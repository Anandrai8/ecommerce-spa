import { useState } from "react";

export default function ItemForm({ item, onSave, onCancel }) {
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item?.price || "");
  const [category, setCategory] = useState(item?.category || "");
  const [image, setImage] = useState(item?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!title.trim()) return "Title is required";
    if (!price || Number(price) <= 0) return "Price must be greater than 0";
    return null;
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true);
    setError("");
    try {
      await onSave({ title, description, price: Number(price), category, image });
      // simple success feedback
      window.alert("Saved");
      if (onCancel) onCancel();
      setTitle(""); setDescription(""); setPrice(""); setCategory(""); setImage("");
    } catch (err) {
      setError(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Price (₹)</label>
        <input className="input" type="number" value={price} onChange={e=>setPrice(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Category</label>
        <input className="input" value={category} onChange={e=>setCategory(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm mb-1">Image URL</label>
        <input className="input" value={image} onChange={e=>setImage(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea className="input" value={description} onChange={e=>setDescription(e.target.value)} />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div className="flex gap-2">
        <button className="btn" disabled={saving} type="submit">{saving ? "Saving..." : "Save"}</button>
        {onCancel && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
