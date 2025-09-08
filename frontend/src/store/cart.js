import { create } from "zustand";

const LS_KEY = "guest_cart";

function readGuest() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch (_) { return []; }
}
function writeGuest(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

const useCart = create((set, get) => ({
  guestItems: readGuest(), // [{ itemId, quantity, item? }]
  setGuestItems: (items) => { writeGuest(items); set({ guestItems: items }); },
  clearGuest: () => { writeGuest([]); set({ guestItems: [] }); }
}));

export default useCart;
