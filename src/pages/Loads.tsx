import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { toast } from "../utils/toast";
import ViewFilesModal from "../components/ViewFilesModal";

type Load = {
  id: string;
  origin: string | null;
  destination: string | null;
  miles: number | null;
  rpm: number | null;
  budget: number | null;
  in_house_first: boolean | null;
  claimed_by_user: string | null;
  created_by: string | null;
  inserted_at: string | null;
};

export default function Loads() {
  const { user } = useAuth();
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ inHouseOnly: boolean; minRPM?: number }>({ inHouseOnly: false });
  const [draft, setDraft] = useState({
    origin: "",
    destination: "",
    miles: "" as number | string,
    rpm: "" as number | string,
    budget: "" as number | string,
    in_house_first: true,
  });
  const [msg, setMsg] = useState("");

  // Modal state for "View Files"
  const [filesOpen, setFilesOpen] = useState(false);
  const [filesLoadId, setFilesLoadId] = useState<string | null>(null);

  // Fetch loads
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("loads")
        .select("*")
        .order("inserted_at", { ascending: false });
      if (!mounted) return;
      if (error) setMsg("❌ " + error.message);
      if (data) setLoads(data as Load[]);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return loads.filter(l => {
      if (filter.inHouseOnly && !l.in_house_first) return false;
      if (filter.minRPM && (l.rpm ?? 0) < filter.minRPM) return false;
      return true;
    });
  }, [loads, filter]);

  async function postLoad() {
    setMsg("");
    if (!user) { setMsg("❌ Login required to post loads."); toast.info("Login required to post loads."); return; }

    const miles = Number(draft.miles || 0);
    const rpm = Number(draft.rpm || 0);
    const budget = Number(draft.budget || 0);
    if (!draft.origin || !draft.destination || miles <= 0 || rpm <= 0) {
      setMsg("❌ Please fill Origin, Destination, Miles, RPM.");
      toast.warning("Please fill Origin, Destination, Miles, and RPM.");
      return;
    }

    const insert = {
      origin: draft.origin, destination: draft.destination, miles, rpm, budget,
      in_house_first: !!draft.in_house_first, created_by: user.id,
    };
    const { data, error } = await supabase.from("loads").insert(insert).select("*").single();
    if (error) { setMsg("❌ " + error.message); toast.error(error.message); return; }
    if (data) {
      setLoads(prev => [data as Load, ...prev]);
      setDraft({ origin: "", destination: "", miles: "", rpm: "", budget: "", in_house_first: true });
      setMsg("✅ Load posted."); toast.success("Load posted.");
    }
  }

  async function claimLoad(id: string) {
    setMsg("");
    if (!user) { setMsg("❌ Login required to claim loads."); toast.info("Login required to claim loads."); return; }

    const { data, error } = await supabase
      .from("loads")
      .update({ claimed_by_user: user.id })
      .eq("id", id)
      .is("claimed_by_user", null)
      .select("*")
      .single();

    if (error) { setMsg("❌ " + error.message); toast.error(error.message); return; }
    if (data) { setLoads(prev => prev.map(l => (l.id === id ? (data as Load) : l))); setMsg("✅ Load claimed."); toast.success("Load claimed."); }
    else { setMsg("⚠️ Already claimed."); toast.warning("Already claimed."); }
  }

  // Open modal with files for a load
  function openFiles(loadId: string) {
    setFilesLoadId(loadId);
    setFilesOpen(true);
  }

  return (
    <section className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h1>Loads</h1>
        <p>Persisted with Supabase. {user ? <b>Signed in</b> : <b>Guest</b>}.</p>
        {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
      </div>

      {/* POST FORM */}
      <div className="card" id="post">
        <h2>Post a Load {user ? "" : "(Login required)"}</h2>
        <div className="grid cols-2">
          <div>
            <label>Origin</label>
            <input value={draft.origin} onChange={e => setDraft(d => ({ ...d, origin: e.target.value }))} placeholder="City, ST" />
          </div>
          <div>
            <label>Destination</label>
            <input value={draft.destination} onChange={e => setDraft(d => ({ ...d, destination: e.target.value }))} placeholder="City, ST" />
          </div>
          <div>
            <label>Miles</label>
            <input type="number" value={draft.miles} onChange={e => setDraft(d => ({ ...d, miles: e.target.value }))} />
          </div>
          <div>
            <label>RPM (Rate per Mile)</label>
            <input type="number" step="0.01" value={draft.rpm} onChange={e => setDraft(d => ({ ...d, rpm: e.target.value }))} />
          </div>
          <div>
            <label>Budget (Max)</label>
            <input type="number" value={draft.budget} onChange={e => setDraft(d => ({ ...d, budget: e.target.value }))} />
          </div>
          <div>
            <label>In-House First?</label>
            <select value={draft.in_house_first ? "yes" : "no"} onChange={e => setDraft(d => ({ ...d, in_house_first: e.target.value === "yes" }))}>
              <option value="yes">Yes (preferred)</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={postLoad} disabled={!user}>Post Load</button>
          <button className="ghost" onClick={() => setDraft({ origin: "", destination: "", miles: "", rpm: "", budget: "", in_house_first: true })}>Reset</button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card">
        <h2>Filters / No-Strings™ Instant</h2>
        <div className="grid cols-2">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <input id="ih" type="checkbox" checked={filter.inHouseOnly} onChange={e => setFilter(f => ({ ...f, inHouseOnly: e.target.checked }))} style={{width:18,height:18}} />
            <label htmlFor="ih">In-House First Only</label>
          </div>
          <div>
            <label>Minimum RPM</label>
            <input type="number" step="0.1" placeholder="e.g. 2.0" value={filter.minRPM ?? ""} onChange={e => setFilter(f => ({ ...f, minRPM: e.target.value ? Number(e.target.value) : undefined }))} />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="card">
        <h2>Available Loads</h2>
        {loading && <p>Loading…</p>}
        {!loading && (
          <div className="grid" style={{gap:14}}>
            <div className="load-row" style={{opacity:.7}}>
              <div>Origin</div><div>Destination</div><div>Miles</div><div>RPM</div><div>Budget</div><div></div>
            </div>

            {filtered.length === 0 && <div className="tag">No loads match your filters.</div>}

            {filtered.map(l => {
              const miles = l.miles ?? 0;
              const rpm = l.rpm ?? 0;
              const budget = l.budget ?? 0;
              const est = Math.min(miles * rpm, budget || Number.POSITIVE_INFINITY);
              return (
                <div key={l.id} className="load-row">
                  <div><span className="tag">{String(l.id).toString().slice(0,8)}</span> {l.origin}</div>
                  <div>{l.destination}</div>
                  <div>{miles.toLocaleString()} mi</div>
                  <div>${rpm.toFixed(2)}/mi</div>
                  <div>{budget ? `$${est.toLocaleString()}` : "—"}</div>
                  <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                    {l.in_house_first ? <span className="tag red">In-House</span> : null}
                    {/* View Files button */}
                    <button className="ghost" onClick={() => openFiles(String(l.id))}>View Files</button>
                    {l.claimed_by_user ? (
                      <span className="tag">Claimed</span>
                    ) : (
                      <button onClick={() => claimLoad(String(l.id))} disabled={!user}>Claim</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Files modal */}
      <ViewFilesModal
        loadId={filesLoadId}
        open={filesOpen}
        onClose={() => setFilesOpen(false)}
      />
    </section>
  );
}
