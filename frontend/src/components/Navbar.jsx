import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ cartCount = 0, authHelpers }) {
  const navigate = useNavigate();
  const user = authHelpers?.user;

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
          {user ? (
            <button
              type="button"
              className="nav__user"
              onClick={() => {
                authHelpers?.logout?.();
                navigate("/");
              }}
            >
              <span className="nav__avatar">{user.name?.[0]?.toUpperCase?.() || "U"}</span>
              <span className="nav__userName">{user.name || user.email}</span>
              <span className="nav__logout">Logout</span>
            </button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

