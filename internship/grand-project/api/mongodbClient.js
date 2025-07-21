  // mongodbClient.js
  const { MongoClient } = require('mongodb');
  require('dotenv').config();

  const client = new MongoClient(process.env.MONGODB_URI);

  async function connectToDatabase() {
    if (!client.isConnected()) await client.connect();
    return client.db('resumeTailor'); // You can name your DB anything
  }

  module.exports = connectToDatabase;