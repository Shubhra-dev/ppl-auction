import { supabase } from "./supabaseClient";

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getMyRole() {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return "viewer";

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) return "viewer";
  return data?.role || "viewer";
}
