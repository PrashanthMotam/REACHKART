import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import "./App.css";

export default function App() {
  const [cartCount, setCartCount] = useState(0);

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

  return (
    <div className="app">
      <Navbar cartCount={cartCount} />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Home cartHelpers={cartHelpers} />} />
          <Route path="/cart" element={<Cart cartHelpers={cartHelpers} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
