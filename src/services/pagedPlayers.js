import { supabase } from "../app/supabaseClient";

/**
 * Generic paged players query.
 * - Uses server-side pagination (range)
 * - Uses count='exact' so you can paginate properly
 */
export async function fetchPlayersPage({
  page = 1,
  pageSize = 20,
  search = "",
  status, // optional: 'pending' | 'sold' | 'unsold'
  teamId, // optional: sold_team_id
  select = "*",
} = {}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from("players")
    .select(select, { count: "exact" })
    .order("order_no", { ascending: true })
    .order("created_at", { ascending: true })
    .range(from, to);

  if (status) q = q.eq("status", status);
  if (teamId) q = q.eq("sold_team_id", teamId);

  const s = search.trim();
  if (s) {
    // name search; you can extend later to specialty
    q = q.ilike("name", `%${s}%`);
  }

  const { data, count, error } = await q;
  if (error) throw new Error(error.message);

  return { items: data || [], total: count || 0 };
}

/** Useful for auction: load the player even if not in current page */
export async function fetchPlayerById(id) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}
