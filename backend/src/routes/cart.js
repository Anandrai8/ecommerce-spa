import { Router } from "express";
import User from "../models/User.js";
import Item from "../models/Item.js";
import { auth } from "../middleware/auth.js";

const router = Router();
router.use(auth);

router.get("/", async (req, res) => {
  await req.user.populate("cart.item");
  res.json({ cart: req.user.cart });
});

router.post("/add", async (req, res) => {
  const { itemId, quantity = 1 } = req.body;
  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  const idx = req.user.cart.findIndex((ci) => ci.item.toString() === itemId);
  if (idx >= 0) {
    req.user.cart[idx].quantity += Number(quantity);
  } else {
    req.user.cart.push({ item: itemId, quantity: Number(quantity) });
  }
  await req.user.save();
  await req.user.populate("cart.item");
  res.json({ cart: req.user.cart });
});

router.patch("/update", async (req, res) => {
  const { itemId, quantity } = req.body;
  const idx = req.user.cart.findIndex((ci) => ci.item.toString() === itemId);
  if (idx === -1) return res.status(404).json({ message: "Not in cart" });

  if (Number(quantity) <= 0) {
    req.user.cart.splice(idx, 1);
  } else {
    req.user.cart[idx].quantity = Number(quantity);
  }
  await req.user.save();
  await req.user.populate("cart.item");
  res.json({ cart: req.user.cart });
});

router.post("/sync", async (req, res) => {
  const { items = [] } = req.body; // [{ itemId, quantity }]
  for (const inc of items) {
    const idx = req.user.cart.findIndex((ci) => ci.item.toString() === inc.itemId);
    if (idx >= 0) {
      req.user.cart[idx].quantity = Math.max(req.user.cart[idx].quantity, Number(inc.quantity));
    } else {
      req.user.cart.push({ item: inc.itemId, quantity: Number(inc.quantity) });
    }
  }
  await req.user.save();
  await req.user.populate("cart.item");
  res.json({ cart: req.user.cart });
});

router.delete("/clear", async (req, res) => {
  req.user.cart = [];
  await req.user.save();
  res.json({ ok: true });
});

export default router;
