import { useState, useEffect } from "react";

export default function FilterBar({ onChange, categories }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const id = setTimeout(() => onChange({ q, category, minPrice, maxPrice }), 400);
    return () => clearTimeout(id);
  }, [q, category, minPrice, maxPrice]);

  return (
    <div className="card mb-6 grid md:grid-cols-5 gap-3">
      <input className="input md:col-span-2" placeholder="Search..." value={q} onChange={(e)=>setQ(e.target.value)} />
      <select className="input" value={category} onChange={(e)=>setCategory(e.target.value)}>
        <option value="">All categories</option>
        {categories.map((c)=> <option key={c} value={c}>{c}</option>)}
      </select>
      <input className="input" type="number" placeholder="Min price" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} />
      <input className="input" type="number" placeholder="Max price" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
    </div>
  );
}
