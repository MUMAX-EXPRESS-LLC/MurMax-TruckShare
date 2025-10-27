import { useEffect, useState } from "react";
import { NavLink, Route, Routes, Link } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./lib/supabase";

import Home from "./pages/Home";
import Drivers from "./pages/Drivers";
import Dispatchers from "./pages/Dispatchers";
import Leasing from "./pages/Leasing";
import NoStrings from "./pages/NoStrings";
import Loads from "./pages/Loads";
import MyLoads from "./pages/MyLoads";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

/* ✅ Navigation components */
import BottomBar from "./components/BottomBar";
import FabPost from "./components/FabPost";

/* ✅ Toast host (rendered before BottomBar/FAB) */
import Toaster from "./components/Toaster";

import "./App.css";

export default function App() {
  const { user, ready } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    window.addEventListener("popstate", close);
    return () => {
      window.removeEventListener("hashchange", close);
      window.removeEventListener("popstate", close);
    };
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <div className="app">
      {/* --- Top Navbar --- */}
      <nav className="topnav" role="navigation" aria-label="Primary">
        <div className="brand">
          <span>MurMax Express®</span>
          <span className="badge">Truckshare</span>
        </div>

        {/* Desktop tabs */}
        <div className="tabs tabs-desktop">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/loads">Loads</NavLink>
          <NavLink to="/my-loads">My Loads</NavLink>
          <NavLink to="/drivers">Drivers</NavLink>
          <NavLink to="/dispatchers">Dispatchers</NavLink>
          <NavLink to="/leasing">Leasing</NavLink>
          <NavLink to="/no-strings">No-Strings™ Instant</NavLink>
        </div>

        {/* Auth area (desktop) */}
        <div className="auth-cluster">
          {ready && (user ? (
            <>
              <span className="tag auth-email">{user.email ?? "Signed in"}</span>
              <button className="ghost" onClick={() => supabase.auth.signOut()}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="tag">Login</Link>
          ))}
        </div>

        {/* Hamburger for mobile */}
        <button
          className="hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
      </nav>

      {/* --- Mobile Slide-Down Menu --- */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mobile-menu-inner">
          <div className="tabs tabs-mobile" onClick={() => setMenuOpen(false)}>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/loads">Loads</NavLink>
            <NavLink to="/my-loads">My Loads</NavLink>
            <NavLink to="/drivers">Drivers</NavLink>
            <NavLink to="/dispatchers">Dispatchers</NavLink>
            <NavLink to="/leasing">Leasing</NavLink>
            <NavLink to="/no-strings">No-Strings™ Instant</NavLink>
          </div>

          <div className="auth-mobile">
            {ready && (user ? (
              <>
                <span className="tag auth-email">{user.email ?? "Signed in"}</span>
                <button className="ghost" onClick={() => { setMenuOpen(false); supabase.auth.signOut(); }}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="tag" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <main className="content" onClick={() => menuOpen && setMenuOpen(false)}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loads" element={<Loads />} />
          <Route path="/my-loads" element={<MyLoads />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/dispatchers" element={<Dispatchers />} />
          <Route path="/leasing" element={<Leasing />} />
          <Route path="/no-strings" element={<NoStrings />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* --- Footer --- */}
      <div className="footer">
        © {new Date().getFullYear()} MurMax Express® — Command Through Cognition™
      </div>

      {/* ✅ Toast host (rendered before bars for proper z-index layering) */}
      <Toaster />

      {/* --- Mobile Bottom Action Bar --- */}
      <BottomBar />

      {/* --- Desktop Floating “+ Post Load” FAB --- */}
      <FabPost />
    </div>
  );
}
