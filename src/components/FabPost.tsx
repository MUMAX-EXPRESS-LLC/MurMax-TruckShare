import { Link, useLocation } from "react-router-dom";

export default function FabPost() {
  const { pathname } = useLocation();
  const toPost = pathname.startsWith("/loads") ? "#post" : "/loads#post";

  return (
    <Link
      to={toPost}
      className="fab-post"
      aria-label="Post a Load"
      title="Post a Load"
    >
      <span className="fab-plus" aria-hidden>+</span>
      <span className="fab-label">Post Load</span>
    </Link>
  );
}
