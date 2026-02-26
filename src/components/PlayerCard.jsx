export default function PlayerCard({ p, teamMap }) {
  const soldTeam = p?.sold_team_id ? teamMap?.[p.sold_team_id] : null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden h-full">
      <div className="aspect-[16/10] bg-slate-900">
        {p.photo_url ? (
          <img
            src={p.photo_url}
            alt={p.name}
            className="w-full h-full object-fill object-center"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-slate-400 text-sm">
            No Photo
          </div>
        )}
      </div>

      <div className="pt-4 px-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-slate-300">{p.specialty}</div>
          </div>

          <span className="text-xs px-2 py-1 rounded-full bg-slate-800">
            {p.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-slate-300">Base: ৳{p.base_price}</div>
          {p.status === "sold" ? (
            <div className="font-semibold">Sold: ৳{p.sold_price}</div>
          ) : null}
        </div>

        {/* ✅ Sold team */}
        {p.status === "sold" && soldTeam ? (
          <div className="my-2 flex items-center gap-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-900 grid place-items-center">
              {soldTeam.logo_url ? (
                <img
                  src={soldTeam.logo_url}
                  alt={soldTeam.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] text-slate-400">Logo</span>
              )}
            </div>
            <div className="text-xs text-slate-200">
              Bought by <span className="font-semibold">{soldTeam.name}</span>
            </div>
          </div>
        ) : null}

        {/* Sold but team missing (edge case) */}
        {p.status === "sold" && !soldTeam ? (
          <div className="my-2 text-xs text-slate-300">
            Bought by: <span className="font-semibold">Unknown team</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
