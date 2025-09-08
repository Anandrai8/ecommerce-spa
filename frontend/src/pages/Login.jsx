import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api.js";
import useAuth from "../store/auth.js";
import useCart from "../store/cart.js";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { guestItems, clearGuest } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data);
      // merge guest cart -> server
      if (guestItems.length) {
        await api.post("/cart/sync", { items: guestItems.map(g => ({ itemId: g.itemId, quantity: g.quantity })) });
        clearGuest();
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="btn w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
      <p className="text-sm text-slate-400 mt-4">No account? <Link className="underline" to="/signup">Signup</Link></p>
    </div>
  );
}
