import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { login, register } from "../api";

export default function Login({ authHelpers }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { email, password };
      if (mode === "register") payload.name = name || email.split("@")[0];

      const fn = mode === "register" ? register : login;
      const res = await fn(payload);
      if (!res?.success) throw new Error(res?.message || "Auth failed");

      const { token, user } = res.data || {};
      if (token && user) {
        localStorage.setItem("miniEkartToken", token);
        localStorage.setItem("miniEkartUser", JSON.stringify(user));
        if (authHelpers?.setUser) {
          authHelpers.setUser(user);
        }
      }
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page">
      <div className="authCard">
        <div className="authCard__header">
          <button
            type="button"
            className={`authTab ${mode === "login" ? "authTab--active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`authTab ${mode === "register" ? "authTab--active" : ""}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form className="authForm" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <label className="authField">
              <span>Name</span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </label>
          ) : null}

          <label className="authField">
            <span>Email</span>
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="authField">
            <span>Password</span>
            <input
              className="input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error ? <div className="error">{error}</div> : null}

          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? <Loader label={mode === "login" ? "Logging in..." : "Registering..."} /> : null}
            {!loading ? (mode === "login" ? "Login" : "Register") : null}
          </button>
        </form>
      </div>
    </div>
  );
}

