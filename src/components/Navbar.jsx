import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../app/supabaseClient";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm ${
    isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-900"
  }`;

export default function Navbar() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session || null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession || null);
      },
    );

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold tracking-tight">
          PPL
        </Link>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/committee" className={navClass}>
            Board
          </NavLink>
          <NavLink to="/teams" className={navClass}>
            Teams
          </NavLink>
          {/* <NavLink to="/live" className={navClass}>
            Live
          </NavLink> */}
          <NavLink to="/admin" className={navClass}>
            Admin
          </NavLink>

          {/* ✅ Show Logout only if logged in */}
          {session ? (
            <button
              onClick={logout}
              className="ml-2 px-3 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin/login")}
              className="ml-2 px-3 py-2 rounded-lg text-sm bg-white text-slate-950 font-semibold"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
