import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, resume_id, job_description, tailored_resume } = body;

    if (!user_id || !resume_id || !job_description || !tailored_resume) {
      return NextResponse.json(
        { error: 'user_id, resume_id, job_description, and tailored_resume are required' },
        { status: 400 }
      );
    }

    // Save to Supabase history table
    const { data, error } = await supabase
      .from('history')
      .insert([
        {
          user_id,
          resume_id,
          job_description,
          tailored_resume,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save history', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      history_id: data?.[0]?.id,
      message: 'History saved successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 