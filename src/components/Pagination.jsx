export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50],
}) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
      <div className="text-xs text-slate-300">
        Page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{totalPages}</span> • Total{" "}
        <span className="font-semibold">{total || 0}</span>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm outline-none"
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>
              {n}/page
            </option>
          ))}
        </select>

        <button
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm disabled:opacity-60"
        >
          Prev
        </button>

        <button
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm disabled:opacity-60"
        >
          Next
        </button>
      </div>
    </div>
  );
}
