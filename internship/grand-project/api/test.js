  // test.js
  const supabase = require('./supabaseClient');
  const connectToDatabase = require('./mongodbClient');

  async function testConnections() {
    // Test Supabase
    const { data, error } = await supabase.from('test').select('*');
    if (error) {
      console.log('Supabase error:', error.message);
    } else {
      console.log('Supabase data:', data);
    }

    // Test MongoDB
    try {
      const db = await connectToDatabase();
      const collections = await db.collections();
      console.log('MongoDB collections:', collections.map(c => c.collectionName));
    } catch (err) {
      console.log('MongoDB error:', err.message);
    }
  }

  testConnections();