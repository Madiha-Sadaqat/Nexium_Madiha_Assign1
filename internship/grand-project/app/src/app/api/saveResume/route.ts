import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { MongoClient } from 'mongodb';

// Initialize MongoDB client
const client = new MongoClient(process.env.MONGODB_URI!);

async function connectToMongoDB() {
  try {
    await client.connect();
  } catch (error: unknown) {
    // If already connected, ignore the error
    if (error instanceof Error && error.message !== 'MongoClient is already connected') {
      throw error;
    }
  }
  return client.db('resume-tailor');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume_text, user_id } = body;

    // For now, use the user_id from the request body
    // In production, you'd validate this against the session
    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    if (!resume_text) {
      return NextResponse.json(
        { error: 'resume_text is required' },
        { status: 400 }
      );
    }

    // Check for duplicate resume with same content
    const { data: existingResumes, error: checkError } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', user_id)
      .eq('resume_text', resume_text);

    if (checkError) {
      console.error('Error checking for duplicates:', checkError);
    } else if (existingResumes && existingResumes.length > 0) {
      console.log('Duplicate resume found, skipping save');
      return NextResponse.json({
        success: true,
        message: 'Resume already exists',
        existing_id: existingResumes[0].id
      });
    }

    // Save to Supabase
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('resumes')
      .insert([
        {
          user_id,
          resume_text,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      
      // Handle RLS (Row Level Security) error
      if (supabaseError.code === '42501') {
        return NextResponse.json(
          { 
            error: 'Database access denied. Please check your Supabase RLS policies.',
            details: 'Row-level security policy violation. You may need to enable RLS bypass or create proper policies.',
            code: supabaseError.code
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to save to Supabase', details: supabaseError.message },
        { status: 500 }
      );
    }

    const supabaseId = supabaseData?.[0]?.id;

    // Save to MongoDB
    try {
      const db = await connectToMongoDB();
      const mongoResult = await db.collection('resumes').insertOne({
        user_id,
        resume_text,
        supabase_id: supabaseId, // Store Supabase ID in MongoDB
        created_at: new Date(),
        updated_at: new Date()
      });

      const mongoId = mongoResult.insertedId;

      // Update Supabase record with MongoDB ID
      if (supabaseId) {
        await supabase
          .from('resumes')
          .update({ mongo_id: mongoId.toString() })
          .eq('id', supabaseId);
      }

      return NextResponse.json({
        success: true,
        supabase_id: supabaseId,
        mongo_id: mongoId,
        message: 'Resume saved successfully to both databases'
      });
    } catch (mongoError) {
      console.error('MongoDB error:', mongoError);
      // Return success for Supabase even if MongoDB fails
      return NextResponse.json({
        success: true,
        supabase_id: supabaseId,
        message: 'Resume saved to Supabase (MongoDB failed)'
      });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 