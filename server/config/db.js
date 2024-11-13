import "dotenv/config";
import { MongoClient } from "mongodb";

let db;
const client = new MongoClient(process.env.MONGO_URI);

// Connect to MongoDB
const connectToDB = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db(process.env.DB_NAME);
      console.log(`Connected to MongoDB`);
    } catch (err) {
      console.log(`Error connecting to MongoDB: ${err}`);
      throw err;
    }
  }
  return db;
};

const getCollection = async (collectionName) => {
  const db = await connectToDB();
  return db.collection(collectionName);
};

const getUsersCollection = await getCollection("users");

export { connectToDB, getUsersCollection };
