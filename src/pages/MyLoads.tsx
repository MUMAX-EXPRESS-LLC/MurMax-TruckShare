import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

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

type Mode = "both" | "created" | "claimed";

export default function MyLoads() {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("both");
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function fetchMyLoads(m: Mode) {
    if (!user) return;
    setLoading(true);
    setMsg("");
    let q = supabase.from("loads").select("*").order("inserted_at", { ascending: false });

    if (m === "created") {
      q = q.eq("created_by", user.id);
    } else if (m === "claimed") {
      q = q.eq("claimed_by_user", user.id);
    } else {
      q = q.or(`created_by.eq.${user.id},claimed_by_user.eq.${user.id}`);
    }

    const { data, error } = await q;
    if (error) setMsg("❌ " + error.message);
    if (data) setLoads(data as Load[]);
    setLoading(false);
  }

  useEffect(() => {
    if (user) fetchMyLoads(mode);
  }, [user, mode]);

  const createdCount = useMemo(() => loads.filter(l => l.created_by === user?.id).length, [loads, user]);
  const claimedCount = useMemo(() => loads.filter(l => l.claimed_by_user === user?.id).length, [loads, user]);

  if (!user) {
    return (
      <section className="card" style={{maxWidth:560, margin:"0 auto"}}>
        <h1>My Loads</h1>
        <p>Please sign in to view loads you posted or claimed.</p>
      </section>
    );
  }

  return (
    <section className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h1>My Loads</h1>
        <p>Viewing loads for <b>{user.email ?? "your account"}</b>.</p>
        {msg && <p style={{marginTop:8}}>{msg}</p>}

        {/* Segmented toggle */}
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button className={mode==="both"?"":"ghost"} onClick={()=>setMode("both")}>Both ({loads.length})</button>
          <button className={mode==="created"?"":"ghost"} onClick={()=>setMode("created")}>Created ({createdCount})</button>
          <button className={mode==="claimed"?"":"ghost"} onClick={()=>setMode("claimed")}>Claimed ({claimedCount})</button>
          <button className="ghost" onClick={()=>fetchMyLoads(mode)} disabled={loading}>{loading?"Refreshing…":"Refresh"}</button>
        </div>
      </div>

      <div className="card">
        <h2>Results</h2>
        {loading && <p>Loading…</p>}
        {!loading && (
          <div className="grid" style={{gap:14}}>
            <div className="load-row" style={{opacity:.7}}>
              <div>Origin</div><div>Destination</div><div>Miles</div><div>RPM</div><div>Budget</div><div></div>
            </div>

            {loads.length === 0 && <div className="tag">No loads in this view.</div>}

            {loads.map(l => {
              const miles = l.miles ?? 0;
              const rpm = l.rpm ?? 0;
              const budget = l.budget ?? 0;
              const est = Math.min(miles * rpm, budget || Number.POSITIVE_INFINITY);
              const youCreated = l.created_by === user.id;
              const youClaimed = l.claimed_by_user === user.id;

              return (
                <div key={l.id} className="load-row">
                  <div><span className="tag">{l.id.slice(0,8)}</span> {l.origin}</div>
                  <div>{l.destination}</div>
                  <div>{miles.toLocaleString()} mi</div>
                  <div>${rpm.toFixed(2)}/mi</div>
                  <div>{budget ? `$${est.toLocaleString()}` : "—"}</div>
                  <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                    {l.in_house_first ? <span className="tag red">In-House</span> : null}
                    {youCreated && <span className="tag">Created by you</span>}
                    {youClaimed && <span className="tag">Claimed by you</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
