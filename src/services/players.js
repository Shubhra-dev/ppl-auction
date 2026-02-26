import { supabase } from "../app/supabaseClient";

export async function uploadPublicAsset({ file, folder }) {
  if (!file) throw new Error("File is required");

  const safeName = file.name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-_.]/g, "")
    .toLowerCase();

  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

  const { error: upErr } = await supabase.storage
    .from("ppl-assets")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (upErr) throw new Error(upErr.message);

  const { data } = supabase.storage.from("ppl-assets").getPublicUrl(path);
  return data.publicUrl;
}

export async function getPlayers() {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("order_no", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createPlayer(payload) {
  const { data, error } = await supabase
    .from("players")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updatePlayer(id, payload) {
  const { data, error } = await supabase
    .from("players")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePlayer(id) {
  const { error } = await supabase.from("players").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
