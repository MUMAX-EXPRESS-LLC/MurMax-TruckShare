import { useEffect, useState } from "react";
import { onToast } from "../utils/toast";

type Item = { id: string; kind: "success"|"error"|"info"|"warning"; message: string; timeout: number };

export default function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    return onToast(({ id, kind, message, timeout = 3000 }) => {
      setItems(prev => [...prev, { id, kind, message, timeout }]);
      if (timeout > 0) setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), timeout);
    });
  }, []);

  return (
    <div className="toaster" aria-live="polite" aria-atomic="true">
      {items.map(t => (
        <div key={t.id} className={`toast ${t.kind}`} role="status">
          <span className="toast-dot" />
          <div className="toast-msg">{t.message}</div>
          <button
            className="toast-close"
            aria-label="Dismiss"
            onClick={() => setItems(prev => prev.filter(x => x.id !== t.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
