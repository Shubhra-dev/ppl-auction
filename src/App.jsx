import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
import Teams from "./pages/Teams";
import Live from "./pages/Live";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import GuardAdmin from "./components/GuardAdmin";
// import Fixture from "./pages/Fixture";
import TournamentHighlights from "./pages/Home2";
import TournamentCommitteeSection from "./pages/TournametCommittee";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<TournamentHighlights />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/live" element={<Live />} />
          <Route path="/committee" element={<TournamentCommitteeSection />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <GuardAdmin>
                <AdminDashboard />
              </GuardAdmin>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
