import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { addToCart, getProductById } from "../api";

export default function ProductDetails({ cartHelpers }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await getProductById(id);
        if (!res?.success) throw new Error(res?.message || "Failed to load product");
        if (!cancelled) setProduct(res.data);
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e?.message || "Failed to load product");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleAdd() {
    if (!product?._id) return;
    try {
      setAdding(true);
      const res = await addToCart(product._id, 1);
      if (!res?.success) throw new Error(res?.message || "Failed to add to cart");
      if (cartHelpers?.increment) {
        cartHelpers.increment(1);
      }
      setNotice("Added to cart");
      setTimeout(() => setNotice(""), 1500);
    } catch (e) {
      setNotice(e?.response?.data?.message || e?.message || "Failed to add to cart");
      setTimeout(() => setNotice(""), 2000);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="container page">
      <button className="btn btn--small" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {loading ? <Loader label="Loading product..." /> : null}
      {!loading && error ? <div className="error">{error}</div> : null}

      {notice ? <div className="notice">{notice}</div> : null}

      {!loading && !error && product ? (
        <div className="productDetail">
          <div className="productDetail__media">
            <img
              className="productDetail__img"
              src={product.image || "https://picsum.photos/seed/detail/800/500"}
              alt={product.name}
            />
          </div>
          <div className="productDetail__info">
            <span className="badge">{product.category || "General"}</span>
            <h1 className="productDetail__title">{product.name}</h1>
            <p className="productDetail__price">₹{Number(product.price || 0).toFixed(0)}</p>
            <p className="productDetail__desc">{product.description || "No description."}</p>
            <p className="muted">
              In stock: <strong>{product.stock ?? 0}</strong>
            </p>
            <div className="productDetail__actions">
              <button className="btn btn--primary" onClick={handleAdd} disabled={adding}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

