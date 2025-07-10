import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('title').text();
    const main =
      $('article').text() ||
      $('main').text() ||
      $('body').text();

    return NextResponse.json({ title, main });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch or parse blog' }, { status: 500 });
  }
}
