import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import Signup from "./pages/Signup.jsx";
import Catalog from "./pages/Catalog.jsx";
import Cart from "./pages/Cart.jsx";
import useAuth from "./store/auth.js";

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">ShopEasy</Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:underline">Listing</Link>
          <Link to="/cart" className="hover:underline">Cart</Link>
          {user?.role === "admin" && <Link to="/admin" className="hover:underline">Admin</Link>}
          {!user && (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Signup</Link>
            </>
          )}
          {user && (
            <button onClick={logout} className="btn">Logout</button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="text-center text-sm text-slate-400 py-6">
        © {new Date().getFullYear()} ShopEasy
      </footer>
    </div>
  );
}
