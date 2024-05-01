const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Connect to MongoDB
const connectToDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(`Error connecting to MongoDB: ${err}`);
  }
};

const db = client.db("CRUD_Project");
const usersCollection = db.collection("users");

module.exports = { client, usersCollection, connectToDB };
