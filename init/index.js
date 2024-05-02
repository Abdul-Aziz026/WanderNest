const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
const MONGO_URL = "mongodb+srv://alhamdulillah026:Alhamdulillah18CSE026LLL@clustaer0.xvjeezh.mongodb.net/wanderlust";
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    // Initialize database
    initDB();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Function to initialize the database with sample data
async function initDB() {
  try {
    // Clear existing data
    await Listing.deleteMany({});
    // Insert initial data
    await Listing.insertMany(initData.data);
    console.log("Data initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
