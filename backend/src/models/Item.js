import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: Number,
    category: String,
    image: String,
    stock: Number,
  },
  { timestamps: true } // createdAt, updatedAt automatically add ho jaayega
);

export default mongoose.model("Item", itemSchema);
