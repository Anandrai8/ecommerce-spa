import { Router } from "express";
import Item from "../models/Item.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET items with filters
router.get("/", async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      q,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) {
      filter.$text = { $search: q };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const items = await Item.find(filter)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Item.countDocuments(filter);
    res.json({ items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin CRUD
router.post("/", auth, requireAdmin, async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid item data" });
  }
});

router.put("/:id", auth, requireAdmin, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid item data" });
  }
});

router.delete("/:id", auth, requireAdmin, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid item id" });
  }
});

// Seed (dev)
router.post("/seed", async (_req, res) => {
  try {
    const sample = [
      {
        title: "Blue T-shirt",
        description: "100% cotton",
        price: 499,
        category: "Apparel",
        image: "https://via.placeholder.com/400x300?text=Blue+T-shirt"
      },
      {
        title: "Running Shoes",
        description: "Lightweight & comfy",
        price: 1999,
        category: "Footwear",
        image: "https://via.placeholder.com/400x300?text=Shoes"
      },
      {
        title: "Wireless Earbuds",
        description: "Great sound, long battery",
        price: 2999,
        category: "Electronics",
        image: "https://via.placeholder.com/400x300?text=Earbuds"
      }
    ];
    await (await import("../models/Item.js")).default.deleteMany({});
    const created = await (await import("../models/Item.js")).default.insertMany(sample);
    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seed error" });
  }
});

export default router;
