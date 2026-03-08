import { useEffect, useMemo, useState } from "react";
import { supabase } from "../app/supabaseClient";
import PlayerCard from "../components/PlayerCard";
import Pagination from "../components/Pagination";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchPlayersPage } from "../services/pagedPlayers";
// async function downloadCSV() {
//   const { data } = await supabase
//     .from("players")
//     .select("*")
//     .order("order_no", { ascending: true });

//   const csv = Papa.unparse(data || []);

//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.download = "players.csv";
//   link.click();
// }

async function downloadPDF() {
  const { data } = await supabase
    .from("players")
    .select("*")
    .order("order_no", { ascending: true });

  const doc = new jsPDF();

  const rows =
    data?.map((p) => [
      p.order_no,
      p.name,
      p.specialty,
      p.base_price,
      p.status,
      p.sold_price || "",
    ]) || [];

  autoTable(doc, {
    head: [
      ["Order", "Name", "Specialty", "Base Price", "Status", "Sold Price"],
    ],
    body: rows,
  });

  doc.save("players.pdf");
}

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ✅ public search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const teamMap = useMemo(() => {
    const map = {};
    for (const t of teams) map[t.id] = t;
    return map;
  }, [teams]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  async function loadTeams() {
    const { data: ts } = await supabase
      .from("teams")
      .select("id,name,logo_url")
      .order("created_at", { ascending: true });

    setTeams(ts || []);
  }

  async function loadPlayersPage() {
    const { items, total } = await fetchPlayersPage({
      page,
      pageSize,
      search: debouncedSearch,
      select:
        "id,name,order_no,status,specialty,base_price,photo_url,sold_team_id,sold_price",
    });

    setPlayers(items);
    setTotalPlayers(total);
  }

  async function loadAll() {
    setLoading(true);
    try {
      await Promise.all([loadTeams(), loadPlayersPage()]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await loadAll();
    })();

    const channel = supabase
      .channel("home-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => loadPlayersPage(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        () => loadTeams(),
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reload page on page/pageSize/search changes
  useEffect(() => {
    loadPlayersPage().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, debouncedSearch]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        Loading players...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Players</h1>
          <p className="text-slate-300 text-sm">Auction results update live.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadPDF}
            className="px-3 py-2 text-xs bg-slate-800 rounded-xl"
          >
            Download PDF
          </button>
        </div>
        {/* ✅ Public Search */}
        <div className="w-full sm:w-[320px]">
          <label className="text-xs text-slate-300">Search players</label>
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="type name…"
            className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
          />
        </div>
      </div>

      {players.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
          No players found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((p) => (
            <PlayerCard key={p.id} p={p} teamMap={teamMap} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={totalPlayers}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPage(1);
          setPageSize(n);
        }}
      />
    </div>
  );
}
