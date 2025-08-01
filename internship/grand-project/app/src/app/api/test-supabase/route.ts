import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('resumes')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase test error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      });
    }

    console.log('Supabase connection successful');
    return NextResponse.json({
      success: true,
      message: 'Supabase connection working',
      data: data
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    });
  }
} 