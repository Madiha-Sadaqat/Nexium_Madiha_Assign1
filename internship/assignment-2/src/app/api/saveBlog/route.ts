import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { url, title, main, date } = await req.json();
    if (!url || !title || !main) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(); // Uses the default database from the URI
    const collection = db.collection('blogs');

    const doc = { url, title, main, date: date || new Date().toISOString(), createdAt: new Date() };
    const result = await collection.insertOne(doc);

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error('MongoDB save error:', error);
    return NextResponse.json({ error: 'Failed to save blog' }, { status: 500 });
  }
} 