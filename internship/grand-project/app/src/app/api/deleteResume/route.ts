import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MongoClient, ObjectId } from 'mongodb';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Initialize MongoDB client
const client = new MongoClient(process.env.MONGODB_URI!);

async function connectToMongoDB() {
  try {
    await client.connect();
  } catch (error: any) {
    // If already connected, ignore the error
    if (error.message !== 'MongoClient is already connected') {
      throw error;
    }
  }
  return client.db('resume-tailor');
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resume_id = searchParams.get('resume_id');
    const user_id = searchParams.get('user_id');

    console.log('Delete request - resume_id:', resume_id, 'user_id:', user_id);

    if (!resume_id || !user_id) {
      console.error('Missing required parameters');
      return NextResponse.json(
        { error: 'resume_id and user_id are required' },
        { status: 400 }
      );
    }

    let deletedFromSupabase = false;
    let deletedFromMongo = false;
    let supabaseError = null;
    let mongoError = null;

    // Check if resume_id is a MongoDB ObjectId (24 hex characters)
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(resume_id);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resume_id);

    console.log('ID analysis - isMongoId:', isMongoId, 'isUuid:', isUuid);

    // Delete from both databases
    if (isMongoId) {
      // If it's a MongoDB ID, delete from MongoDB first, then get Supabase ID and delete from Supabase
      try {
        console.log('Attempting to delete from MongoDB...');
        const db = await connectToMongoDB();
        
        // Get the record first to find the Supabase ID
        const record = await db.collection('resumes').findOne({ _id: new ObjectId(resume_id) });
        
        if (record) {
          // Delete from MongoDB
          const result = await db.collection('resumes').deleteOne({
            _id: new ObjectId(resume_id),
            user_id: user_id
          });

          console.log('MongoDB delete result:', result);
          if (result.deletedCount > 0) {
            console.log('Successfully deleted from MongoDB');
            deletedFromMongo = true;
            
            // Now delete from Supabase using the stored Supabase ID
            if (record.supabase_id) {
              try {
                console.log('Attempting to delete from Supabase using stored ID:', record.supabase_id);
                const { error } = await supabase
                  .from('resumes')
                  .delete()
                  .eq('id', record.supabase_id)
                  .eq('user_id', user_id);

                if (error) {
                  console.error('Supabase delete error:', error);
                  supabaseError = error;
                } else {
                  console.log('Successfully deleted from Supabase');
                  deletedFromSupabase = true;
                }
              } catch (error) {
                console.error('Supabase delete exception:', error);
                supabaseError = error;
              }
            }
          } else {
            console.log('No document found in MongoDB to delete');
          }
        } else {
          console.log('Record not found in MongoDB');
        }
      } catch (error) {
        console.error('MongoDB delete error:', error);
        mongoError = error;
      }
    } else if (isUuid) {
      // If it's a UUID, delete from Supabase first, then get MongoDB ID and delete from MongoDB
      try {
        console.log('Attempting to delete from Supabase...');
        
        // Get the record first to find the MongoDB ID
        const { data: record, error: fetchError } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', resume_id)
          .eq('user_id', user_id)
          .single();

        if (fetchError) {
          console.error('Error fetching record from Supabase:', fetchError);
        } else if (record) {
          // Delete from Supabase
          const { error } = await supabase
            .from('resumes')
            .delete()
            .eq('id', resume_id)
            .eq('user_id', user_id);

          if (error) {
            console.error('Supabase delete error:', error);
            supabaseError = error;
          } else {
            console.log('Successfully deleted from Supabase');
            deletedFromSupabase = true;
            
            // Now delete from MongoDB using the stored MongoDB ID
            if (record.mongo_id) {
              try {
                console.log('Attempting to delete from MongoDB using stored ID:', record.mongo_id);
                const db = await connectToMongoDB();
                const result = await db.collection('resumes').deleteOne({
                  _id: new ObjectId(record.mongo_id),
                  user_id: user_id
                });

                console.log('MongoDB delete result:', result);
                if (result.deletedCount > 0) {
                  console.log('Successfully deleted from MongoDB');
                  deletedFromMongo = true;
                } else {
                  console.log('No document found in MongoDB to delete');
                }
              } catch (error) {
                console.error('MongoDB delete error:', error);
                mongoError = error;
              }
            }
          }
        } else {
          console.log('Record not found in Supabase');
        }
      } catch (error) {
        console.error('Supabase delete exception:', error);
        supabaseError = error;
      }
    } else {
      console.log('Invalid ID format - not a MongoDB ObjectId or UUID');
    }

    console.log('Delete summary - Supabase:', deletedFromSupabase, 'MongoDB:', deletedFromMongo);

    if (deletedFromSupabase || deletedFromMongo) {
      const message = deletedFromSupabase && deletedFromMongo 
        ? 'Resume deleted from both databases'
        : deletedFromSupabase 
        ? 'Resume deleted from Supabase'
        : 'Resume deleted from MongoDB';
        
      return NextResponse.json({
        success: true,
        message,
        deletedFromSupabase,
        deletedFromMongo,
        supabaseError: supabaseError ? (supabaseError as any).message : null,
        mongoError: mongoError ? (mongoError as any).message : null
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Resume not found or could not be deleted',
          supabaseError: supabaseError ? (supabaseError as any).message : null,
          mongoError: mongoError ? (mongoError as any).message : null
        },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 