import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    // Truncate content to 2000 characters (safe for BART)
    const truncated = content.slice(0, 2000);

    const hfToken = process.env.HUGGINGFACE_API_TOKEN;
    const hfRes = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(hfToken ? { 'Authorization': `Bearer ${hfToken}` } : {}),
      },
      body: JSON.stringify({ inputs: truncated }),
    });

    const hfData = await hfRes.json();
    if (Array.isArray(hfData) && hfData[0]?.summary_text) {
      return NextResponse.json({ summary: hfData[0].summary_text });
    } else if (hfData.error) {
      return NextResponse.json({ error: hfData.error }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }
  } catch (err) {
    console.error('Summarise API error:', err);
    return NextResponse.json({ error: 'Failed to summarise' }, { status: 500 });
  }
}