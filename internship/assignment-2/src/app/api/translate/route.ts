import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Add the required language token for Urdu
    const input = `>>urd<< ${text}`;

    const hfToken = process.env.HUGGINGFACE_API_TOKEN;
    const hfRes = await fetch('https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-iir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(hfToken ? { 'Authorization': `Bearer ${hfToken}` } : {}),
      },
      body: JSON.stringify({ inputs: input }),
    });

    if (!hfRes.ok) {
      const errorText = await hfRes.text();
      console.error('Hugging Face API error:', errorText);
      return NextResponse.json({ error: errorText }, { status: 500 });
    }

    const hfData = await hfRes.json();
    if (Array.isArray(hfData) && hfData[0]?.translation_text) {
      return NextResponse.json({ urdu: hfData[0].translation_text });
    } else if (hfData.error) {
      return NextResponse.json({ error: hfData.error }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
    }
  } catch (err) {
    console.error('Translate API error:', err);
    return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
  }
} 