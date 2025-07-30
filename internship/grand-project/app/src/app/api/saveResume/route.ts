import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MongoClient } from 'mongodb';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Initialize MongoDB client
const client = new MongoClient(process.env.MONGODB_URI!);

async function connectToMongoDB() {
  if (!client.isConnected()) await client.connect();
  return client.db('resume-tailor');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, resume_text } = body;

    if (!user_id || !resume_text) {
      return NextResponse.json(
        { error: 'user_id and resume_text are required' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'Failed to save to Supabase', details: supabaseError.message },
        { status: 500 }
      );
    }

    // Save to MongoDB
    try {
      const db = await connectToMongoDB();
      const mongoResult = await db.collection('resumes').insertOne({
        user_id,
        resume_text,
        created_at: new Date(),
        updated_at: new Date()
      });

      return NextResponse.json({
        success: true,
        supabase_id: supabaseData?.[0]?.id,
        mongo_id: mongoResult.insertedId,
        message: 'Resume saved successfully to both databases'
      });
    } catch (mongoError) {
      console.error('MongoDB error:', mongoError);
      // Return success for Supabase even if MongoDB fails
      return NextResponse.json({
        success: true,
        supabase_id: supabaseData?.[0]?.id,
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