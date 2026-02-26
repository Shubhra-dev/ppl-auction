import { useEffect, useMemo, useState } from "react";
import {
  createTeam,
  deleteTeam,
  getTeams,
  updateTeam,
  uploadPublicAsset,
} from "../services/teams";

const emptyForm = {
  name: "",
  purse_total: "",
  max_players: "",
  min_players: "",
  logo_url: "",
};

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const isEditing = Boolean(editingId);

  const canSave = useMemo(() => {
    const n = form.name.trim();
    const purse = Number(form.purse_total);
    const maxP = Number(form.max_players);
    const minP = Number(form.min_players);

    return (
      n.length > 1 &&
      Number.isFinite(purse) &&
      purse >= 0 &&
      Number.isFinite(maxP) &&
      maxP >= 0 &&
      Number.isFinite(minP) &&
      minP >= 0
    );
  }, [form]);

  async function load() {
    setLoading(true);
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (e) {
      setMsg(e.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function onEdit(t) {
    setEditingId(t.id);
    setForm({
      name: t.name || "",
      purse_total: String(t.purse_total ?? ""),
      max_players: String(t.max_players ?? ""),
      min_players: String(t.min_players ?? ""),
      logo_url: t.logo_url || "",
    });
    setLogoFile(null);
    setMsg("");
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
    setLogoFile(null);
    setMsg("");
  }

  async function handleUploadLogoIfNeeded() {
    if (!logoFile) return form.logo_url || "";
    const url = await uploadPublicAsset({ file: logoFile, folder: "teams" });
    return url;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSave) return;

    setSaving(true);
    setMsg("");

    try {
      const logo_url = await handleUploadLogoIfNeeded();

      const payload = {
        name: form.name.trim(),
        logo_url: logo_url || null,
        purse_total: Number(form.purse_total),
        max_players: Number(form.max_players),
        min_players: Number(form.min_players),
      };

      if (isEditing) {
        await updateTeam(editingId, payload);
        setMsg("Team updated ✅");
      } else {
        await createTeam(payload);
        setMsg("Team created ✅");
      }

      reset();
      await load();
    } catch (e2) {
      setMsg(e2.message || "Failed to save team");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    const ok = confirm("Delete this team? This cannot be undone.");
    if (!ok) return;

    setMsg("");
    try {
      await deleteTeam(id);
      setMsg("Team deleted ✅");
      await load();
    } catch (e) {
      setMsg(e.message || "Failed to delete team");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Teams</h2>
          <p className="text-sm text-slate-300">
            Create 6 teams, set purse/max/min, upload logo.
          </p>
        </div>

        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
        >
          New Team
        </button>
      </div>

      {msg ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
          {msg}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="font-semibold">
            {isEditing ? "Edit Team" : "Create Team"}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-slate-300">Team Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                placeholder="Dhaka Warriors"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-slate-300">Purse</label>
                <input
                  value={form.purse_total}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, purse_total: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Max</label>
                <input
                  value={form.max_players}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, max_players: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                  placeholder="15"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Min</label>
                <input
                  value={form.min_players}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, min_players: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                  placeholder="11"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300">Logo (upload)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
              />
              <div className="mt-2 text-xs text-slate-400">
                If you upload, it will save to Supabase Storage and store the
                URL.
              </div>
            </div>

            {form.logo_url ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={form.logo_url}
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-slate-300 break-all">
                  {form.logo_url}
                </div>
              </div>
            ) : null}

            <button
              disabled={!canSave || saving}
              className="w-full rounded-xl bg-white text-slate-950 font-semibold py-2 disabled:opacity-60"
            >
              {saving ? "Saving..." : isEditing ? "Update Team" : "Create Team"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="font-semibold">All Teams</div>

          {loading ? (
            <div className="mt-4 text-slate-300 text-sm">Loading...</div>
          ) : teams.length === 0 ? (
            <div className="mt-4 text-slate-300 text-sm">
              No teams yet. Create 6 teams.
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {teams.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 grid place-items-center">
                      {t.logo_url ? (
                        <img
                          src={t.logo_url}
                          alt={t.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">Logo</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-slate-300">
                        Purse: ৳{t.purse_total} • Max: {t.max_players} • Min:{" "}
                        {t.min_players}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onEdit(t)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="flex-1 px-3 py-2 rounded-xl bg-red-600/20 border border-red-700 hover:bg-red-600/30 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
