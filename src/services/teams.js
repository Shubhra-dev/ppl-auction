import { supabase } from "../app/supabaseClient";

/**
 * Upload a file to Storage and return public URL.
 * folder example: "teams"
 */
export async function uploadPublicAsset({ file, folder }) {
  if (!file) throw new Error("File is required");

  const ext = file.name.split(".").pop();
  const safeName = file.name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-_.]/g, "")
    .toLowerCase();

  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

  const { error: upErr } = await supabase.storage
    .from("ppl-assets")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (upErr) throw new Error(upErr.message);

  const { data } = supabase.storage.from("ppl-assets").getPublicUrl(path);
  return data.publicUrl;
}

export async function getTeams() {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createTeam(payload) {
  const { data, error } = await supabase
    .from("teams")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateTeam(id, payload) {
  const { data, error } = await supabase
    .from("teams")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTeam(id) {
  const { error } = await supabase.from("teams").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
