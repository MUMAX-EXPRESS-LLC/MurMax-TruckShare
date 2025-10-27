import { NavLink, Route, Routes, Link } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";              // <- add
import { supabase } from "./lib/supabase";              // <- add

// ... your imports
import Home from "./pages/Home";
import Drivers from "./pages/Drivers";
import Dispatchers from "./pages/Dispatchers";
import Leasing from "./pages/Leasing";
import NoStrings from "./pages/NoStrings";
import Loads from "./pages/Loads";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import "./App.css";

export default function App() {
  const { user, ready } = useAuth();

  return (
    <div className="app">
      <nav className="topnav">
        <div className="brand">
          <span>MurMax Express®</span>
          <span className="badge">Truckshare</span>
        </div>
        <div className="tabs">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/loads">Loads</NavLink>
          <NavLink to="/drivers">Drivers</NavLink>
          <NavLink to="/dispatchers">Dispatchers</NavLink>
          <NavLink to="/leasing">Leasing</NavLink>
          <NavLink to="/no-strings">No-Strings™ Instant</NavLink>
        </div>

        {/* Auth status on the right */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          {ready && (user ? (
            <>
              <span className="tag">{user.email ?? "Signed in"}</span>
              <button className="ghost" onClick={() => supabase.auth.signOut()}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="tag">Login</Link>
          ))}
        </div>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loads" element={<Loads />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/dispatchers" element={<Dispatchers />} />
          <Route path="/leasing" element={<Leasing />} />
          <Route path="/no-strings" element={<NoStrings />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <div className="footer">
        © {new Date().getFullYear()} MurMax Express® — Command Through Cognition™
      </div>
    </div>
  );
}
