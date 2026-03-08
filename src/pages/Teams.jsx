import { useEffect, useMemo, useState } from "react";
import { supabase } from "../app/supabaseClient";
import TeamCard from "../components/TeamCard";
import PlayerCard from "../components/PlayerCard";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PlayerRow from "../components/PlayerRow";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [loading, setLoading] = useState(true);

  function downloadTeamPDF() {
    if (!selectedTeam) return;

    const doc = new jsPDF();

    const rows = selectedTeamPlayers.map((p) => [
      p.order_no,
      p.name,
      p.specialty,
      p.base_price,
      p.sold_price,
    ]);

    autoTable(doc, {
      head: [["Order", "Name", "Specialty", "Base Price", "Sold Price"]],
      body: rows,
    });

    doc.save(`${selectedTeam.name}_players.pdf`);
  }
  const teamMap = useMemo(() => {
    const map = {};
    for (const t of teams) map[t.id] = t;
    return map;
  }, [teams]);

  const selectedTeam = selectedTeamId ? teamMap[selectedTeamId] : null;

  const selectedTeamPlayers = useMemo(() => {
    if (!selectedTeamId) return [];
    return players.filter(
      (p) => p.status === "sold" && p.sold_team_id === selectedTeamId,
    );
  }, [players, selectedTeamId]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const [{ data: ts }, { data: ps }] = await Promise.all([
        supabase
          .from("team_stats")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase
          .from("players")
          .select("*")
          .order("order_no", { ascending: true })
          .order("created_at", { ascending: true }),
      ]);

      if (!mounted) return;
      setTeams(ts || []);
      setPlayers(ps || []);
      setLoading(false);

      // auto select first team if none selected
      if (!selectedTeamId && (ts?.length || 0) > 0) {
        setSelectedTeamId(ts[0].id);
      }
    }

    load();

    const channel = supabase
      .channel("teams-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        () => load(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => load(),
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        Loading teams...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Teams</h1>
        <p className="text-slate-300 text-sm">
          Click a team to view its squad.
        </p>
      </div>

      {/* Teams list */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTeamId(t.id)}
            className={`text-left rounded-2xl ${
              selectedTeamId === t.id ? "ring-2 ring-white/50" : ""
            }`}
          >
            <TeamCard t={t} />
          </button>
        ))}
      </div>

      {/* Selected team players */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold">
              {selectedTeam ? selectedTeam.name : "Select a team"}
            </div>
            <div className="text-sm text-slate-300">
              Players bought: {selectedTeamPlayers.length}
            </div>
          </div>

          {selectedTeam ? (
            <div className="text-xs px-3 py-2 rounded-xl bg-slate-800">
              Remaining: ৳{selectedTeam.purse_remaining}
            </div>
          ) : null}
        </div>

        {selectedTeamPlayers.length === 0 ? (
          <div className="mt-4 text-sm text-slate-300">
            No players bought yet.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {selectedTeamPlayers.map((p) => (
              <PlayerRow key={p.id} p={p} teamMap={teamMap} />
            ))}
          </div>
        )}
        <button
          onClick={downloadTeamPDF}
          className="px-3 py-2 text-xs bg-slate-800 rounded-xl my-4"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
