import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMyRole } from "../app/auth";

export default function GuardAdmin({ children }) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("viewer");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await getMyRole();
        if (mounted) setRole(r);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        Loading...
      </div>
    );
  }

  if (role !== "admin") return <Navigate to="/admin/login" replace />;
  return children;
}
