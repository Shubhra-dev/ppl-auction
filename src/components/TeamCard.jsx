export default function TeamCard({ t }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden grid place-items-center">
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
            Players: {t.player_count}/{t.max_players} • Min: {t.min_players}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl bg-slate-900 p-2">
          <div className="text-slate-400">Purse</div>
          <div className="font-semibold">৳{t.purse_total}</div>
        </div>
        <div className="rounded-xl bg-slate-900 p-2">
          <div className="text-slate-400">Spent</div>
          <div className="font-semibold">৳{t.purse_spent}</div>
        </div>
        <div className="rounded-xl bg-slate-900 p-2">
          <div className="text-slate-400">Left</div>
          <div className="font-semibold">৳{t.purse_remaining}</div>
        </div>
      </div>
    </div>
  );
}
