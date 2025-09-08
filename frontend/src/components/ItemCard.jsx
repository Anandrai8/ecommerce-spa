import useAuth from "../store/auth.js";
import useCart from "../store/cart.js";
import api from "../lib/api.js";

export default function ItemCard({ item, onChanged }) {
  const { token } = useAuth();
  const { guestItems, setGuestItems } = useCart();

  const addToCart = async () => {
    if (token) {
      await api.post("/cart/add", { itemId: item._id, quantity: 1 });
      onChanged?.();
    } else {
      const existing = guestItems.find((g) => g.itemId === item._id);
      let next;
      if (existing) {
        next = guestItems.map((g) => g.itemId === item._id ? { ...g, quantity: g.quantity + 1 } : g);
      } else {
        next = [...guestItems, { itemId: item._id, quantity: 1, item }];
      }
      setGuestItems(next);
      onChanged?.();
    }
  };

  return (
    <div className="card flex flex-col">
      <img src={item.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.title)}`} className="rounded-xl mb-3 aspect-[4/3] object-cover" />
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="font-semibold">₹{item.price}</div>
        <button className="btn" onClick={addToCart}>Add</button>
      </div>
    </div>
  );
}
