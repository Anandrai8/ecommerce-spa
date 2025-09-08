import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    quantity: { type: Number, min: 1, default: 1 }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    cart: [cartItemSchema]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
