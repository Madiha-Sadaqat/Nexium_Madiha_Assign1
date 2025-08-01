import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin));
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
} 