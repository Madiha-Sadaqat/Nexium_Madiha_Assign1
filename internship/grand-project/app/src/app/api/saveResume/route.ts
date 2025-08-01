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
    console.log('SaveResume API called');
    const body = await request.json();
    const { resume_text, user_id } = body;

    console.log('Request body:', { resume_text: resume_text?.substring(0, 50) + '...', user_id });

    // For now, use the user_id from the request body
    // In production, you'd validate this against the session
    if (!user_id) {
      console.error('Missing user_id');
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    if (!resume_text) {
      console.error('Missing resume_text');
      return NextResponse.json(
        { error: 'resume_text is required' },
        { status: 400 }
      );
    }

    console.log('Checking for duplicates...');
    // Check for duplicate resume with same content
    const { data: existingResumes, error: checkError } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', user_id)
      .eq('resume_text', resume_text);

    if (checkError) {
      console.error('Error checking for duplicates:', checkError);
      return NextResponse.json(
        { error: 'Failed to check for duplicates', details: checkError.message },
        { status: 500 }
      );
    } else if (existingResumes && existingResumes.length > 0) {
      console.log('Duplicate resume found, skipping save');
      return NextResponse.json({
        success: true,
        message: 'Resume already exists',
        existing_id: existingResumes[0].id
      });
    }

    console.log('Saving to Supabase...');
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

    console.log('Successfully saved to Supabase:', supabaseData);
    const supabaseId = supabaseData?.[0]?.id;

    // Save to MongoDB
    try {
      console.log('Saving to MongoDB...');
      const db = await connectToMongoDB();
      const mongoResult = await db.collection('resumes').insertOne({
        user_id,
        resume_text,
        supabase_id: supabaseId, // Store Supabase ID in MongoDB
        created_at: new Date(),
        updated_at: new Date()
      });

      const mongoId = mongoResult.insertedId;
      console.log('Successfully saved to MongoDB:', mongoId);

      // Update Supabase record with MongoDB ID
      if (supabaseId) {
        const { error: updateError } = await supabase
          .from('resumes')
          .update({ mongo_id: mongoId.toString() })
          .eq('id', supabaseId);

        if (updateError) {
          console.error('Error updating Supabase with MongoDB ID:', updateError);
        }
      }

      return NextResponse.json({
        success: true,
        supabase_id: supabaseId,
        mongo_id: mongoId.toString(),
        message: 'Resume saved successfully'
      });

    } catch (mongoError) {
      console.error('MongoDB error:', mongoError);
      // Return success even if MongoDB fails, since Supabase succeeded
      return NextResponse.json({
        success: true,
        supabase_id: supabaseId,
        message: 'Resume saved to Supabase successfully (MongoDB failed)'
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