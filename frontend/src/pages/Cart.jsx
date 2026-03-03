import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { getCart, removeCartItem, updateCartItem } from "../api";

export default function Cart({ cartHelpers }) {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const res = await getCart();
      if (!res?.success) throw new Error(res?.message || "Failed to load cart");
      const list = res.data?.items || [];
      setItems(list);
      setCartTotal(res.data?.cartTotal || 0);
      if (cartHelpers?.setFromItems) {
        cartHelpers.setFromItems(list);
      }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load cart");
      setItems([]);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function changeQty(id, action) {
    try {
      setBusyId(id);
      const res = await updateCartItem(id, action);
      if (!res?.success) throw new Error(res?.message || "Failed to update item");
      setCartTotal(res.data?.cartTotal || 0);

      setItems((prev) => {
        let next = prev;
        if (!res.data?.item) {
          next = prev.filter((x) => x._id !== id);
        } else {
          next = prev.map((x) => (x._id === id ? res.data.item : x));
        }
        if (cartHelpers?.setFromItems) {
          cartHelpers.setFromItems(next);
        }
        return next;
      });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to update item");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id) {
    try {
      setBusyId(id);
      const res = await removeCartItem(id);
      if (!res?.success) throw new Error(res?.message || "Failed to remove item");
      setItems((prev) => {
        const next = prev.filter((x) => x._id !== id);
        if (cartHelpers?.setFromItems) {
          cartHelpers.setFromItems(next);
        }
        return next;
      });
      setCartTotal(res.data?.cartTotal || 0);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to remove item");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="container page">
      <div className="page__header">
        <div>
          <h1 className="h1">Cart</h1>
          <p className="muted">Review items and place your order.</p>
        </div>
        <div className="cartTotal">
          <span className="muted">Total</span>
          <span className="cartTotal__value">₹{Number(cartTotal || 0).toFixed(0)}</span>
        </div>
      </div>

      {loading ? <Loader label="Loading cart..." /> : null}
      {!loading && error ? <div className="error">{error}</div> : null}

      {!loading && !error && items.length === 0 ? <div className="empty">Cart is empty</div> : null}

      {!loading && !error && items.length > 0 ? (
        <div className="cartList">
          {items.map((item) => {
            const p = item.productId || {};
            return (
              <div className="cartItem" key={item._id}>
                <img
                  className="cartItem__img"
                  src={p.image || "https://picsum.photos/seed/cart/500/350"}
                  alt={p.name || "Product"}
                  loading="lazy"
                />
                <div className="cartItem__info">
                  <div className="cartItem__name">{p.name || "Unknown product"}</div>
                  <div className="muted">₹{Number(p.price || 0).toFixed(0)}</div>
                </div>
                <div className="cartItem__qty">
                  <button
                    className="btn btn--small"
                    onClick={() => changeQty(item._id, "dec")}
                    disabled={busyId === item._id}
                  >
                    −
                  </button>
                  <span className="cartItem__qtyValue">{item.quantity}</span>
                  <button
                    className="btn btn--small"
                    onClick={() => changeQty(item._id, "inc")}
                    disabled={busyId === item._id}
                  >
                    +
                  </button>
                </div>
                <div className="cartItem__actions">
                  <button
                    className="btn btn--danger btn--small"
                    onClick={() => remove(item._id)}
                    disabled={busyId === item._id}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="cartFooter">
            <button
              className="btn btn--primary"
              onClick={() => alert("Order Placed Successfully")}
            >
              Place Order
            </button>
            <button className="btn" onClick={refresh}>
              Refresh
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

