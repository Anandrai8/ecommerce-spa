// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Item from "./src/models/Item.js";

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecom";
// await mongoose.connect(MONGO_URI);
// console.log("Connected to MongoDB");

// const sample = [
//   { name: "Blue T-shirt", description: "100% cotton", price: 499, category: "Apparel", image: "", stock: 100 },
//   { name: "Running Shoes", description: "Lightweight & comfy", price: 1999, category: "Footwear", image: "", stock: 50 },
//   { name: "Wireless Earbuds", description: "Great sound, long battery", price: 2999, category: "Electronics", image: "", stock: 30 }
// ];

// await Item.deleteMany({});      // Delete old items
// await Item.insertMany(sample);  // Insert new items
// console.log("Seeded items:", sample.length);

// await mongoose.disconnect();
