import { useEffect, useMemo, useState } from "react";
import {
  createPlayer,
  deletePlayer,
  updatePlayer,
  uploadPublicAsset,
} from "../services/players";
import { supabase } from "../app/supabaseClient";
import PlayerCard from "../components/PlayerCard";
import Pagination from "../components/Pagination";
import { fetchPlayersPage } from "../services/pagedPlayers";

const emptyForm = {
  name: "",
  specialty: "",
  base_price: "",
  order_no: "",
  photo_url: "",
};

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination + search
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const isEditing = Boolean(editingId);

  const teamMap = useMemo(() => {
    const map = {};
    for (const t of teams) map[t.id] = t;
    return map;
  }, [teams]);

  const canSave = useMemo(() => {
    const n = form.name.trim();
    const sp = form.specialty.trim();
    const base = Number(form.base_price);
    const order = Number(form.order_no);

    return (
      n.length > 1 &&
      sp.length > 1 &&
      Number.isFinite(base) &&
      base >= 0 &&
      Number.isFinite(order) &&
      order >= 0
    );
  }, [form]);

  async function loadTeams() {
    const { data: ts, error } = await supabase
      .from("teams")
      .select("id,name,logo_url")
      .order("created_at", { ascending: true });

    if (error) throw error;
    setTeams(ts || []);
  }

  async function loadPlayersPage() {
    const { items, total } = await fetchPlayersPage({
      page,
      pageSize,
      search,
      select: "*",
    });

    setPlayers(items);
    setTotalPlayers(total);
  }

  async function loadAll() {
    setLoading(true);
    setMsg("");

    try {
      await Promise.all([loadTeams(), loadPlayersPage()]);
    } catch (e) {
      setMsg(e?.message || "Failed to load players/teams");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();

    const channel = supabase
      .channel("admin-players-live")
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

  // refresh player page on page/pageSize/search change
  useEffect(() => {
    loadPlayersPage().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search]);

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setMsg("");
  }

  function onEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      specialty: p.specialty || "",
      base_price: String(p.base_price ?? ""),
      order_no: String(p.order_no ?? ""),
      photo_url: p.photo_url || "",
    });
    setPhotoFile(null);
    setMsg("");
  }

  async function handleUploadPhotoIfNeeded() {
    if (!photoFile) return form.photo_url || "";
    const url = await uploadPublicAsset({ file: photoFile, folder: "players" });
    return url;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSave) return;

    setSaving(true);
    setMsg("");

    try {
      const photo_url = await handleUploadPhotoIfNeeded();

      const payload = {
        name: form.name.trim(),
        specialty: form.specialty.trim(),
        base_price: Number(form.base_price),
        order_no: Number(form.order_no),
        photo_url: photo_url || null,
      };

      if (isEditing) {
        await updatePlayer(editingId, payload);
        setMsg("Player updated ✅");
      } else {
        await createPlayer(payload);
        setMsg("Player created ✅");
      }

      reset();

      // after create/update, go to first page so you can see it easily (optional but helpful)
      setPage(1);
      await loadPlayersPage();
    } catch (e2) {
      setMsg(e2?.message || "Failed to save player");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    const ok = confirm("Delete this player? This cannot be undone.");
    if (!ok) return;

    setMsg("");
    try {
      await deletePlayer(id);

      // keep pagination valid if last item removed
      const newTotal = Math.max(0, totalPlayers - 1);
      const lastPage = Math.max(1, Math.ceil(newTotal / pageSize));
      if (page > lastPage) setPage(lastPage);

      setMsg("Player deleted ✅");
      await loadPlayersPage();
    } catch (e) {
      setMsg(e?.message || "Failed to delete player");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Players</h2>
          <p className="text-sm text-slate-300">
            Pagination enabled. Search by name. Sold players show “Bought by”.
          </p>
        </div>

        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
        >
          New Player
        </button>
      </div>

      {msg ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
          {msg}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Form */}
        <div
          className={`lg:col-span-2 rounded-2xl border border-slate-800 ${
            isEditing ? "bg-green-800/40" : "bg-slate-900/40"
          } p-4`}
        >
          <div className="font-semibold">
            {isEditing ? "Edit Player" : "Create Player"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-slate-300">Player Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                placeholder="Player name"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300">Specialty</label>
              <input
                value={form.specialty}
                onChange={(e) =>
                  setForm((s) => ({ ...s, specialty: e.target.value }))
                }
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                placeholder="Batsman / Bowler / All-rounder"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-300">Base Price</label>
                <input
                  value={form.base_price}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, base_price: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                  placeholder="5000"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Order No</label>
                <input
                  value={form.order_no}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, order_no: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                  placeholder="1"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300">Photo (upload)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
              />
            </div>

            <button
              disabled={!canSave || saving}
              className="w-full rounded-xl bg-white text-slate-950 font-semibold py-2 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Player"
                  : "Create Player"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="font-semibold">All Players</div>

            <div className="w-full sm:w-[260px]">
              <label className="text-xs text-slate-300">Search</label>
              <input
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="type player name…"
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-4 text-slate-300 text-sm">Loading...</div>
          ) : players.length === 0 ? (
            <div className="mt-4 text-slate-300 text-sm">
              No players found for this page/search.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {players.map((p) => (
                <div key={p.id} className="space-y-2 h-full flex flex-col">
                  <PlayerCard p={p} teamMap={teamMap} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="flex-1 px-3 py-2 rounded-xl bg-red-600/20 border border-red-700 hover:bg-red-600/30 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
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
      </div>
    </div>
  );
}
