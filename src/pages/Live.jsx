import { useEffect, useState } from "react";
import { supabase } from "../app/supabaseClient";

export default function Live() {
  const [state, setState] = useState(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function load() {
      const { data: st } = await supabase
        .from("auction_state")
        .select("*")
        .eq("id", 1)
        .single();

      if (!mounted) return;
      setState(st || null);

      if (st?.current_player_id) {
        const { data: p } = await supabase
          .from("players")
          .select("*")
          .eq("id", st.current_player_id)
          .single();
        if (!mounted) return;
        setPlayer(p || null);
        setLoading(false);
      } else {
        setPlayer(null);
        setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel("live-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auction_state" },
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
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Live Auction</h1>
        <p className="text-slate-300 text-sm">
          Current player and status update instantly.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-300">Status</div>
          <div className="text-sm px-3 py-1 rounded-full bg-slate-800">
            {state?.status || "idle"}
          </div>
        </div>

        {!loading && (
          <div className="mt-6">
            {!player ? (
              <div className="text-slate-300">
                No player selected right now.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-64 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900">
                  {player.photo_url ? (
                    <img
                      src={player.photo_url}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-slate-400 text-sm">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="text-xl font-bold">{player.name}</div>
                  <div className="text-slate-300">{player.specialty}</div>
                  <div className="text-sm text-slate-300">
                    Base price: ৳{player.base_price}
                  </div>

                  <div className="pt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-800">
                      {player.status}
                    </span>

                    {player.status === "sold" ? (
                      <div className="mt-2 text-sm">
                        Sold for{" "}
                        <span className="font-semibold">
                          ৳{player.sold_price}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {loading && (
          <div className="text-white text-2xl text-center">
            Loading current player...
          </div>
        )}
      </div>
    </div>
  );
}
