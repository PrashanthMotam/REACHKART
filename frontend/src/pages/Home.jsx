import { useEffect, useMemo, useState } from "react";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { addToCart, getProducts } from "../api";

export default function Home({ cartHelpers }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, limit: 8 });
  const [notice, setNotice] = useState("");

  const page = meta.page || 1;

  const debouncedSearch = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const t = setTimeout(async () => {
      try {
        const res = await getProducts({ search: debouncedSearch, page, limit: meta.limit });
        if (cancelled) return;
        if (!res?.success) {
          setError(res?.message || "Failed to load products");
          setProducts([]);
          return;
        }
        setProducts(res.data || []);
        if (res.meta) setMeta((m) => ({ ...m, ...res.meta }));
      } catch (e) {
        if (cancelled) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load products");
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page, meta.limit]);

  async function handleAdd(product) {
    try {
      setAddingId(product._id);
      const res = await addToCart(product._id, 1);
      if (!res?.success) throw new Error(res?.message || "Failed to add to cart");
      if (cartHelpers?.increment) {
        cartHelpers.increment(1);
      }
      setNotice("Added to cart");
      setTimeout(() => setNotice(""), 1200);
    } catch (e) {
      setNotice(e?.response?.data?.message || e?.message || "Failed to add to cart");
      setTimeout(() => setNotice(""), 1800);
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div className="container page">
      <div className="page__header">
        <div>
          <h1 className="h1">Products</h1>
          <p className="muted">Search and add items to your cart.</p>
        </div>
        <div className="search">
          <input
            className="input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setMeta((m) => ({ ...m, page: 1 }));
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {notice ? <div className="notice">{notice}</div> : null}

      {loading ? <Loader label="Loading products..." /> : null}
      {!loading && error ? <div className="error">{error}</div> : null}

      {!loading && !error && products.length === 0 ? (
        <div className="empty">No Products Found</div>
      ) : null}

      {!loading && !error && products.length > 0 ? (
        <>
          <div className="grid">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAddToCart={handleAdd}
                disabled={addingId === p._id}
              />
            ))}
          </div>

          <div className="pager">
            <button
              className="btn"
              onClick={() => setMeta((m) => ({ ...m, page: Math.max(1, (m.page || 1) - 1) }))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <span className="pager__text">
              Page {page} of {meta.pages || 1}
            </span>
            <button
              className="btn"
              onClick={() =>
                setMeta((m) => ({ ...m, page: Math.min(m.pages || 1, (m.page || 1) + 1) }))
              }
              disabled={page >= (meta.pages || 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

