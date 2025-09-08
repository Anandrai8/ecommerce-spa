import { useEffect, useState } from "react";
import api from "../lib/api.js";
import useAuth from "../store/auth.js";
import ItemForm from "../components/ItemForm.jsx";

export default function Admin() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchItems();
  }, [user]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/items?limit=100");
      setItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    try {
      await api.post("/items", payload);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await api.put(`/items/${id}`, payload);
      setEditing(null);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/items/${id}`);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  if (!user) return <p className="text-slate-400">Login as admin to manage items.</p>;
  if (user.role !== "admin") return <p className="text-slate-400">You are not an admin.</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin — Items</h1>
      {error && <p className="text-red-400 mb-3">{error}</p>}

      <div className="card mb-4">
        <h2 className="font-medium mb-2">Create new item</h2>
        <ItemForm onSave={handleCreate} />
      </div>

      <div className="space-y-3">
        {items.map(it => (
          <div key={it._id} className="card flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={it.image || `https://via.placeholder.com/120x90?text=${encodeURIComponent(it.title)}`} className="w-28 h-20 object-cover rounded" />
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-slate-400 text-sm">₹{it.price} • {it.category}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={()=>setEditing(it)}>Edit</button>
              <button className="btn" onClick={()=>handleDelete(it._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-slate-900 p-4 rounded-2xl w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-2">Edit Item</h3>
            <ItemForm item={editing} onSave={(payload)=>handleUpdate(editing._id, payload)} onCancel={()=>setEditing(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
