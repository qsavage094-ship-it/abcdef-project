const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agroconnect';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    isConnected = true;
    global.__useLocalDb = false;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    global.__useLocalDb = true;
    console.log(`[MongoDB] Notice: Local MongoDB at ${uri} is not running (${error.message}).`);
    console.log(`[AgroConnect DB] Operating in high-performance persistent local JSON database mode.`);
    return null;
  }
};

const disconnectDB = async () => {
  if (isConnected) {
    try {
      await mongoose.disconnect();
    } catch (e) {
      console.error(e);
    }
  }
};

module.exports = { connectDB, disconnectDB };
