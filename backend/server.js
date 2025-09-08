import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./src/routes/auth.js";
import itemRoutes from "./src/routes/items.js";
import cartRoutes from "./src/routes/cart.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(","),
    credentials: false,
  })
);

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecom";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error", err));

app.get("/", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
