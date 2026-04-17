const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const db = client.db();

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

module.exports = { connectToDatabase, getDb };
