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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Get from Supabase
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return NextResponse.json(
        { error: 'Failed to fetch from Supabase', details: supabaseError.message },
        { status: 500 }
      );
    }

    // Get from MongoDB
    let mongoData: Array<Record<string, unknown>> = [];
    try {
      const db = await connectToMongoDB();
      mongoData = await db.collection('resumes')
        .find({ user_id })
        .sort({ created_at: -1 })
        .toArray();
    } catch (mongoError) {
      console.error('MongoDB error:', mongoError);
      // Continue with Supabase data only
    }

    return NextResponse.json({
      success: true,
      supabase_resumes: supabaseData || [],
      mongo_resumes: mongoData,
      message: 'Resumes fetched successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 