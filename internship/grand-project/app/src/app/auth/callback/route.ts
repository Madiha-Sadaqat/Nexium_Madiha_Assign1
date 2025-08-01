import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  console.log('Auth callback called with URL:', requestUrl.toString());
  console.log('Code present:', !!code);

  if (code) {
    try {
      console.log('Attempting to exchange code for session...');
      await supabase.auth.exchangeCodeForSession(code);
      console.log('Successfully exchanged code for session');
      // URL to redirect to after sign in process completes
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin));
    }
  }

  // If no code, redirect to home page
  console.log('No code provided, redirecting to home');
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 