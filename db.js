const mongoose = require("mongoose");
const process = require("process");
const mongoURI = process.env.MONGO_URI;

async function connectToMongoDb() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

module.exports = connectToMongoDb;
