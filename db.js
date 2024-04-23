const { MongoClient } = require('mongodb')
require("dotenv").config()


const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri);

let db;

async function connectToMongoDB(name) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db(name);
        console.log('Connected to database')
    } catch (errors) {
        console.error('Error connecting to MongoDB', errors)
    }
}

async function getDatabase() {
    return db;
}

async function closeConnection() {
    await client.close();
    console.log('Disconnected from MongoDB');
}

module.exports = {
    connectToMongoDB,
    getDatabase,
    closeConnection
};