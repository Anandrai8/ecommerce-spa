import { useEffect, useState } from "react";
import useAuth from "../store/auth.js";
import useCart from "../store/cart.js";
import api from "../lib/api.js";

export default function Cart() {
  const { token } = useAuth();
  const { guestItems, setGuestItems } = useCart();
  const [serverCart, setServerCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      if (token) {
        const { data } = await api.get("/cart");
        setServerCart(data.cart || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const updateQty = async (itemId, qty) => {
    if (token) {
      await api.patch("/cart/update", { itemId, quantity: qty });
      await load();
    } else {
      const next = guestItems.map((g) => g.itemId === itemId ? { ...g, quantity: qty } : g).filter(g => g.quantity > 0);
      setGuestItems(next);
    }
  };

  const items = token ? serverCart.map(ci => ({ id: ci.item._id, title: ci.item.title, price: ci.item.price, image: ci.item.image, quantity: ci.quantity })) 
                      : guestItems.map(ci => ({ id: ci.itemId, title: ci.item?.title || ci.itemId, price: ci.item?.price || 0, image: ci.item?.image, quantity: ci.quantity }));

  const total = items.reduce((s, it) => s + (it.price * it.quantity), 0);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {loading && token ? <p className="text-slate-400">Loading...</p> : null}
      {items.length === 0 ? <p className="text-slate-400">Your cart is empty.</p> : (
        <div className="space-y-3">
          {items.map(it => (
            <div key={it.id} className="card flex items-center gap-4">
              <img src={it.image || `https://via.placeholder.com/120x90?text=${encodeURIComponent(it.title)}`} className="w-28 h-20 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium">{it.title}</div>
                <div className="text-slate-400 text-sm">₹{it.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn" onClick={()=>updateQty(it.id, Math.max(0, it.quantity - 1))}>-</button>
                <div className="w-10 text-center">{it.quantity}</div>
                <button className="btn" onClick={()=>updateQty(it.id, it.quantity + 1)}>+</button>
              </div>
            </div>
          ))}
          <div className="text-right text-xl font-semibold mt-4">Total: ₹{total}</div>
        </div>
      )}
    </div>
  );
}
