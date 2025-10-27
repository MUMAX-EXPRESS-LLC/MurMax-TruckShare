import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

function IconLoads() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2z"/>
    </svg>
  );
}
function IconMine() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z"/>
    </svg>
  );
}
function IconPost() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2z"/>
    </svg>
  );
}
function IconLogin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M10 17v-2h4v2h-4Zm-2-4v-2h8v2H8Zm-2-4V7h12v2H6Z"/>
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M10 17v-2h4v2h-4Zm-2-4v-2h8v2H8Zm8-6V5H6v14h10v-2h2v4H4V3h12v4h-2Zm2 6l-3-3v2H11v2h4v2l3-3Z"/>
    </svg>
  );
}

export default function BottomBar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const toPost = pathname.startsWith("/loads") ? "#post" : "/loads#post";

  return (
    <div className="bottombar" role="navigation" aria-label="Quick actions">
      <NavLink to="/loads" className="bb-btn">
        <IconLoads /><span>Loads</span>
      </NavLink>

      <NavLink to="/my-loads" className="bb-btn">
        <IconMine /><span>My Loads</span>
      </NavLink>

      <Link to={toPost} className="bb-btn">
        <IconPost /><span>Post</span>
      </Link>

      {user ? (
        <button className="bb-btn" onClick={() => supabase.auth.signOut()}>
          <IconLogout /><span>Logout</span>
        </button>
      ) : (
        <NavLink to="/login" className="bb-btn">
          <IconLogin /><span>Login</span>
        </NavLink>
      )}
    </div>
  );
}
