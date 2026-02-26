import { useEffect, useMemo, useState } from "react";
import { supabase } from "../app/supabaseClient";
import Pagination from "../components/Pagination";
import { fetchPlayersPage, fetchPlayerById } from "../services/pagedPlayers";

export default function AdminAuction() {
  const [teams, setTeams] = useState([]);
  const [auction, setAuction] = useState(null);

  // paged players for selector
  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");

  // selection + sell inputs
  const [currentPlayerId, setCurrentPlayerId] = useState("");
  const [sellTeamId, setSellTeamId] = useState("");
  const [sellPrice, setSellPrice] = useState("");

  // ensure current player details always available
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const activeStatus = auction?.status || "idle";
  const isLivePlayerSelected =
    activeStatus === "live" && auction?.current_player_id === currentPlayerId;

  const canSell =
    Boolean(currentPlayerId) &&
    Boolean(sellTeamId) &&
    String(sellPrice).trim().length > 0 &&
    Number.isFinite(Number(sellPrice)) &&
    Number(sellPrice) >= 0;

  const btnBase =
    "px-4 py-2 rounded-xl text-sm transition border border-transparent disabled:opacity-60 disabled:cursor-not-allowed";
  const btnIdle = "bg-slate-800 hover:bg-slate-700";
  const btnActive = "bg-white text-slate-950 font-semibold";
  const btnDanger = "bg-red-600/20 border border-red-700 hover:bg-red-600/30";
  const btnWarn =
    "bg-amber-500/15 border border-amber-600 hover:bg-amber-500/25";

  function statusButtonClass(key) {
    return `${btnBase} ${activeStatus === key ? btnActive : btnIdle}`;
  }

  async function loadTeamsAndAuction() {
    const [{ data: ts }, { data: au }] = await Promise.all([
      supabase
        .from("team_stats")
        .select("*")
        .order("created_at", { ascending: true }),
      supabase.from("auction_state").select("*").eq("id", 1).single(),
    ]);

    setTeams(ts || []);
    setAuction(au || null);

    if (au?.current_player_id) setCurrentPlayerId(au.current_player_id);
  }

  async function loadPlayersPage() {
    const { items, total } = await fetchPlayersPage({
      page,
      pageSize,
      search,
      // for auctioneer: usually browse pending first, but keep all visible
      // you can uncomment if you only want pending:
      // status: "pending",
      select:
        "id,name,order_no,status,specialty,base_price,photo_url,sold_team_id,sold_price",
    });

    setPlayers(items);
    setTotalPlayers(total);
  }

  async function syncCurrentPlayerDetails() {
    if (!currentPlayerId) {
      setCurrentPlayer(null);
      return;
    }

    // try to find in current page first
    const inList = players.find((p) => p.id === currentPlayerId);
    if (inList) {
      setCurrentPlayer(inList);
      return;
    }

    // fetch by id (because pagination)
    const p = await fetchPlayerById(currentPlayerId);
    setCurrentPlayer(p);
  }

  async function loadAll() {
    setStatusMsg("");
    await Promise.all([loadTeamsAndAuction(), loadPlayersPage()]);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await loadAll();
      } catch (e) {
        setStatusMsg(e?.message || "Failed to load auction data");
      } finally {
        setLoading(false);
      }
    })();

    const channel = supabase
      .channel("admin-auction-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => loadPlayersPage(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        () => loadTeamsAndAuction(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auction_state" },
        () => loadTeamsAndAuction(),
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reload players when page/search/pageSize changes
  useEffect(() => {
    loadPlayersPage().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search]);

  // keep currentPlayer object synced
  useEffect(() => {
    syncCurrentPlayerDetails().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayerId, players]);

  async function runAndSync(fn, successMsg) {
    try {
      setWorking(true);
      setStatusMsg("");
      await fn();
      // force refresh quickly
      await loadAll();
      if (successMsg) setStatusMsg(successMsg);
    } catch (e) {
      setStatusMsg(e?.message || "Operation failed");
    } finally {
      setWorking(false);
    }
  }

  async function clearCurrentPlayerEverywhere(nextStatus = activeStatus) {
    await supabase.rpc("set_auction_state", {
      p_status: nextStatus,
      p_current_player_id: null,
    });
    setCurrentPlayerId("");
    setSellTeamId("");
    setSellPrice("");
  }

  const setAuctionStatus = (nextStatus) =>
    runAndSync(async () => {
      const shouldClear = nextStatus === "idle" || nextStatus === "finished";
      await supabase.rpc("set_auction_state", {
        p_status: nextStatus,
        p_current_player_id: shouldClear ? null : currentPlayerId || null,
      });
      if (shouldClear) {
        setCurrentPlayerId("");
        setSellTeamId("");
        setSellPrice("");
      }
    }, `Auction set to ${nextStatus} ✅`);

  const clearCurrentPlayer = () =>
    runAndSync(async () => {
      await clearCurrentPlayerEverywhere(activeStatus);
    }, "Current player cleared ✅");

  const setLivePlayer = () =>
    runAndSync(async () => {
      await supabase.rpc("set_auction_state", {
        p_status: "live",
        p_current_player_id: currentPlayerId || null,
      });
    }, "Live player set ✅");

  const markUnsold = () =>
    runAndSync(async () => {
      await supabase.rpc("mark_unsold", { p_player_id: currentPlayerId });
      await clearCurrentPlayerEverywhere(activeStatus);
    }, "Marked unsold ✅");

  const unassign = () =>
    runAndSync(async () => {
      await supabase.rpc("unassign_player", { p_player_id: currentPlayerId });
    }, "Player unassigned ✅");

  const sell = () =>
    runAndSync(async () => {
      const price = Number(sellPrice);
      if (!Number.isFinite(price) || price < 0)
        throw new Error("Invalid price");

      await supabase.rpc("sell_player", {
        p_player_id: currentPlayerId,
        p_team_id: sellTeamId,
        p_price: price,
      });

      await clearCurrentPlayerEverywhere(activeStatus);
    }, "Player sold ✅");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Auction</h2>
          <p className="text-sm text-slate-300">
            Paginated players + search for auctioneer.
          </p>
        </div>

        <div className="text-xs px-3 py-2 rounded-xl bg-slate-800">
          Status: <span className="font-semibold">{activeStatus}</span>
        </div>
      </div>

      {statusMsg ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
          {statusMsg}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          Loading...
        </div>
      ) : (
        <>
          {/* Auction status controls */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                disabled={working || activeStatus === "idle"}
                onClick={() => setAuctionStatus("idle")}
                className={statusButtonClass("idle")}
              >
                Idle
              </button>

              <button
                disabled={working || activeStatus === "live"}
                onClick={() => setAuctionStatus("live")}
                className={statusButtonClass("live")}
              >
                Live
              </button>

              <button
                disabled={working || activeStatus === "paused"}
                onClick={() => setAuctionStatus("paused")}
                className={statusButtonClass("paused")}
              >
                Pause
              </button>

              <button
                disabled={working || activeStatus === "finished"}
                onClick={() => setAuctionStatus("finished")}
                className={statusButtonClass("finished")}
              >
                Finish
              </button>

              <button
                disabled={working}
                onClick={clearCurrentPlayer}
                className={`${btnBase} ${btnIdle}`}
              >
                Clear Current Player
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Left: selector + actions */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="font-semibold">Select Current Player</div>
                  <div className="text-xs text-slate-300">
                    Use search, then pick from paginated list.
                  </div>
                </div>

                <div className="w-full sm:w-[320px]">
                  <label className="text-xs text-slate-300">
                    Search player
                  </label>
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

              <select
                className="mt-3 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                value={currentPlayerId}
                onChange={(e) => setCurrentPlayerId(e.target.value)}
              >
                <option value="">-- Select player --</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.order_no} • {p.name} • ({p.status})
                  </option>
                ))}
              </select>

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

              <div className="mt-4 flex flex-wrap gap-2">
                {/* if already live-selected -> hide set live */}
                {!isLivePlayerSelected ? (
                  <button
                    disabled={working || !currentPlayerId}
                    onClick={setLivePlayer}
                    className={`${btnBase} ${btnActive}`}
                  >
                    Set Live Player
                  </button>
                ) : null}

                <button
                  disabled={working || !currentPlayerId}
                  onClick={markUnsold}
                  className={`${btnBase} ${btnWarn}`}
                >
                  Mark Unsold
                </button>

                <button
                  disabled={working || !currentPlayerId}
                  onClick={unassign}
                  className={`${btnBase} ${btnDanger}`}
                >
                  Unassign
                </button>
              </div>

              {currentPlayer ? (
                <div className="mt-6 rounded-2xl bg-slate-950/60 border border-slate-800 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{currentPlayer.name}</div>
                      <div className="text-sm text-slate-300">
                        {currentPlayer.specialty}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-800">
                      {currentPlayer.status}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-slate-300">
                    Base:{" "}
                    <span className="font-semibold">
                      ৳{currentPlayer.base_price}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Right: sell */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="font-semibold">Sell Player</div>

              <label className="mt-3 block text-xs text-slate-300">Team</label>
              <select
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                value={sellTeamId}
                onChange={(e) => setSellTeamId(e.target.value)}
                disabled={working || !currentPlayerId}
              >
                <option value="">-- Select team --</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Left ৳{t.purse_remaining}, {t.player_count}/
                    {t.max_players})
                  </option>
                ))}
              </select>

              <label className="mt-3 block text-xs text-slate-300">
                Final Price
              </label>
              <input
                className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="e.g. 5000"
                inputMode="numeric"
                disabled={working || !currentPlayerId}
              />

              <button
                disabled={working || !canSell}
                onClick={sell}
                className={`${btnBase} ${canSell ? btnActive : btnIdle} w-full mt-4`}
              >
                {working ? "Working..." : "Sell Now"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
