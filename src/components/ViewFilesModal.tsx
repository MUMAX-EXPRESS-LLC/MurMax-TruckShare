import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "../utils/toast";

type UploadRow = {
  id: string;
  file_path: string;
  file_name: string | null;
  uploaded_at: string | null;
  user_id: string | null;
};

function fileIsImage(name: string) {
  const n = name.toLowerCase();
  return n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png") || n.endsWith(".gif") || n.endsWith(".webp");
}

export default function ViewFilesModal({
  loadId,
  open,
  onClose,
}: {
  loadId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<UploadRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !loadId) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("load_uploads")
        .select("id, file_path, file_name, uploaded_at, user_id")
        .eq("load_id", loadId)
        .order("uploaded_at", { ascending: false });
      if (error) {
        toast.error(error.message);
      } else {
        setRows((data as UploadRow[]) || []);
      }
      setLoading(false);
    })();
  }, [open, loadId]);

  function publicUrl(path: string) {
    // Build a public URL from your storage bucket
    const { data } = supabase.storage.from("driver_uploads").getPublicUrl(path);
    return data.publicUrl;
  }

  if (!open) return null;

  return (
    <div className="mf-overlay" role="dialog" aria-modal="true" aria-label="Files for load">
      <div className="mf-dialog">
        <div className="mf-head">
          <h2 style={{ margin: 0 }}>Files for Load</h2>
          <button className="ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {loading ? (
          <p>Loading files…</p>
        ) : rows.length === 0 ? (
          <div className="tag">No files uploaded for this load yet.</div>
        ) : (
          <div className="mf-grid">
            {rows.map((r) => {
              const name = r.file_name || r.file_path.split("/").pop() || "file";
              const url = publicUrl(r.file_path);
              const isImg = fileIsImage(name);
              return (
                <div className="mf-card" key={r.id}>
                  <div className="mf-thumb">
                    {isImg ? (
                      <img src={url} alt={name} />
                    ) : (
                      <div className="mf-icon">📎</div>
                    )}
                  </div>
                  <div className="mf-meta">
                    <div className="mf-name" title={name}>{name}</div>
                    <div className="mf-sub">
                      {r.uploaded_at ? new Date(r.uploaded_at).toLocaleString() : ""}
                    </div>
                  </div>
                  <div className="mf-actions">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="tag">Open</a>
                    <a href={url} download className="tag">Download</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
