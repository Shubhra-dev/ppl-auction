import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../app/supabaseClient";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) return setErr(error.message);

    nav("/admin");
  }

  return (
    <div className="max-w-md mx-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <h1 className="text-xl font-bold">Admin Login</h1>
      <p className="text-sm text-slate-300 mt-1">
        Use Supabase Auth email/password.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <div>
          <label className="text-xs text-slate-300">Email</label>
          <input
            className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ppl.com"
          />
        </div>

        <div>
          <label className="text-xs text-slate-300">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>

        {err ? (
          <div className="text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-xl p-3">
            {err}
          </div>
        ) : null}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-white text-slate-950 font-semibold py-2 hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
