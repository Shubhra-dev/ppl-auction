export default function PlayerRow({ p }) {
  //   const soldTeam = p?.sold_team_id ? teamMap?.[p.sold_team_id] : null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3 flex gap-3 items-center">
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0">
        {p.photo_url ? (
          <img
            src={p.photo_url}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-[10px] text-slate-400">
            No Photo
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold truncate">{p.name}</div>
            <div className="text-xs text-slate-300 truncate">
              {p.specialty} • Base ৳{p.base_price}
            </div>
          </div>
          <div>
            <span className="text-[11px] px-2 py-1 rounded-full bg-slate-800 shrink-0">
              {p.status}
            </span>
            {p.status === "sold" ? (
              <div className="mt-1 text-base text-slate-300 flex items-center gap-2">
                <span className="font-semibold">৳{p.sold_price}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
