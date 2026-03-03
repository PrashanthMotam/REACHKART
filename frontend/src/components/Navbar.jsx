import { Link, NavLink } from "react-router-dom";

export default function Navbar({ cartCount = 0 }) {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link to="/" className="nav__brand">
          Mini Ekart
        </Link>
        <nav className="nav__links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="nav__cart">
              <span>Cart</span>
              {cartCount > 0 ? <span className="nav__cartBadge">{cartCount}</span> : null}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

