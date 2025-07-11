import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }
    // Simulate summary: take first 2 sentences
    const summary = content.split('. ').slice(0, 2).join('. ') + (content.includes('.') ? '.' : '');
    return NextResponse.json({ summary });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to summarise' }, { status: 500 });
  }
} 