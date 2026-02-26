import { useState } from "react";
import AdminAuction from "./AdminAuction";
import AdminTeams from "./AdminTeams";
import AdminPlayers from "./AdminPlayers";

export default function AdminDashboard() {
  const [tab, setTab] = useState("auction");

  const btn = (key, label) => (
    <button
      onClick={() => setTab(key)}
      className={`px-4 py-2 rounded-xl text-sm ${
        tab === key
          ? "bg-white text-slate-950 font-semibold"
          : "bg-slate-800 hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-slate-300">
          Manage teams & players, then run auction.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {btn("auction", "Auction")}
        {btn("teams", "Teams")}
        {btn("players", "Players")}
      </div>

      {tab === "auction" ? <AdminAuction /> : null}
      {tab === "teams" ? <AdminTeams /> : null}
      {tab === "players" ? <AdminPlayers /> : null}
    </div>
  );
}
