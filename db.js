const mongoose = require("mongoose");
// const mongoURI = process.env.MONGO_URI;
const mongoURI =
  "mongodb+srv://Sajid:I75ajGQKzrIMGP3O@cluster0.bzho5hi.mongodb.net/todo-app-db?retryWrites=true&w=majority&appName=Cluster0";

async function connectToMongoDb() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

module.exports = connectToMongoDb;
