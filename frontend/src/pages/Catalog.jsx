import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";
import ItemCard from "../components/ItemCard.jsx";
import FilterBar from "../components/FilterBar.jsx";

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set("q", filters.q);
      if (filters.category) params.set("category", filters.category);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      const { data } = await api.get(`/items?${params.toString()}`);
      setItems(data.items);
      setTotal(data.total);
      const cats = Array.from(new Set(data.items.map((i) => i.category).filter(Boolean)));
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [JSON.stringify(filters)]);

  return (
    <div>
      <FilterBar onChange={setFilters} categories={categories} />
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <>
          <p className="text-slate-400 mb-3">{total} items</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((it) => <ItemCard key={it._id} item={it} onChanged={fetchItems} />)}
          </div>
        </>
      )}
    </div>
  );
}
