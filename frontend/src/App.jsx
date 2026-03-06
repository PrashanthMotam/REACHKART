import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import "./App.css";

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("miniEkartUser");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const cartHelpers = useMemo(
    () => ({
      cartCount,
      setCartCount,
      setFromItems(items) {
        const count = (items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(count);
      },
      increment(by = 1) {
        setCartCount((c) => c + by);
      },
      replace(count) {
        setCartCount(count || 0);
      },
    }),
    [cartCount]
  );

  const authHelpers = useMemo(
    () => ({
      user,
      setUser,
      logout() {
        try {
          localStorage.removeItem("miniEkartToken");
          localStorage.removeItem("miniEkartUser");
        } catch {
          // ignore
        }
        setUser(null);
      },
    }),
    [user]
  );

  return (
    <div className="app">
      <Navbar cartCount={cartCount} authHelpers={authHelpers} />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Home cartHelpers={cartHelpers} />} />
          <Route path="/cart" element={<Cart cartHelpers={cartHelpers} />} />
          <Route path="/products/:id" element={<ProductDetails cartHelpers={cartHelpers} />} />
          <Route path="/login" element={<Login authHelpers={authHelpers} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
