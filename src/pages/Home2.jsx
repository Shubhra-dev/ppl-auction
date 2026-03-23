import {
  Crown,
  Medal,
  ShieldCheck,
  Sparkles,
  Camera,
  HeartHandshake,
} from "lucide-react";

const tournamentData = {
  sponsor: {
    name: "Nazipur Thai Aluminum",
    title: "Title Sponsor",
    description:
      "Official title sponsor of the PPL 2026, proudly supporting community cricket, fair play, and sporting excellence.",
  },

  champions: {
    name: "PPL Challengers",
    title: "Champions",
    logo: "https://nndigctjfwmlnypdsedu.supabase.co/storage/v1/object/public/ppl-assets/teams/1772629112324-25a21893-a51c-44ac-9946-369b9a3d2448-ppl-challengers.png",
    description:
      "PPL Challengers emerged as the tournament champions with outstanding consistency, discipline, and match-winning performances throughout the competition.",
  },

  runnersUp: {
    name: "PPL Eagles",
    title: "Runners-Up",
    logo: "https://nndigctjfwmlnypdsedu.supabase.co/storage/v1/object/public/ppl-assets/teams/1772629167668-2748daf6-874f-4c60-9fd6-1d93c76b441d-ppl-eagles.png",
    description:
      "PPL Eagles delivered a remarkable campaign and secured the runners-up position through determination, resilience, and competitive cricket.",
  },

  stats: [
    { label: "Total Teams", value: "6" },
    { label: "Total Players", value: "78" },
    { label: "Total Matches", value: "9" },
    { label: "Champion", value: "PPL Challengers" },
    { label: "Runners-Up", value: "PPL Eagles" },
    { label: "Season Status", value: "Completed" },
  ],

  gallery: [
    {
      id: 1,
      title: "Opening Moments",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      title: "Team Celebration",
      image:
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      title: "Match Action",
      image:
        "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 4,
      title: "Final Showdown",
      image:
        "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 5,
      title: "Champions Lift",
      image:
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 6,
      title: "Tournament Spirit",
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c643e7485?auto=format&fit=crop&w=1200&q=80",
    },
  ],

  thankYou: {
    title: "Thank You",
    description:
      "Sincere thanks to all participating teams, players, organizers, supporters, and our title sponsor Nazipur Thai Aluminum for making Puia Premier League 2026 a successful and memorable event.",
  },
};

function StatCard({ item }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
        {item.label}
      </div>
      <div className="mt-2 text-lg font-bold text-white">{item.value}</div>
    </div>
  );
}

function TeamHonorCard({ team, isChampion = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 ${
        isChampion
          ? "border-yellow-400/30 bg-gradient-to-br from-yellow-500/20 via-amber-400/10 to-slate-950 shadow-[0_0_0_1px_rgba(250,204,21,0.08),0_25px_90px_rgba(250,204,21,0.16)]"
          : "border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.22)]"
      }`}
    >
      {isChampion ? (
        <>
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-8 top-8 h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.16),transparent_40%)]" />
          <div className="pointer-events-none absolute right-6 top-6 text-yellow-300/20">
            <Crown size={84} />
          </div>
        </>
      ) : null}

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
              isChampion
                ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                : "border-slate-700 bg-slate-800 text-slate-200"
            }`}
          >
            {isChampion ? (
              <Crown size={14} className="text-yellow-300" />
            ) : (
              <Medal size={14} className="text-slate-300" />
            )}
            {team.title}
          </div>

          <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
            {team.name}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            {team.description}
          </p>

          {isChampion ? (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-sm font-medium text-yellow-200">
              <Sparkles size={16} />
              Tournament Winner
            </div>
          ) : null}
        </div>

        <div className="relative shrink-0 self-start md:self-center">
          {isChampion ? (
            <div className="absolute inset-0 rounded-full bg-yellow-300/20 blur-2xl" />
          ) : null}

          <div
            className={`relative flex h-28 w-28 items-center justify-center rounded-full border sm:h-32 sm:w-32 ${
              isChampion
                ? "border-yellow-300/40 bg-white shadow-[0_0_45px_rgba(250,204,21,0.26)]"
                : "border-slate-700 bg-white"
            }`}
          >
            <img
              src={team.logo}
              alt={team.name}
              className="h-20 w-20 object-contain sm:h-24 sm:w-24 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// function CommitteeCard({ member }) {
//   return (
//     <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-[0_10px_25px_rgba(0,0,0,0.14)]">
//       <div className="text-lg font-semibold text-white">{member.name}</div>
//       <div className="mt-1 text-sm text-slate-400">{member.role}</div>
//     </div>
//   );
// }

function GalleryCard({ item, featured = false }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-slate-800 ${
        featured ? "min-h-[320px]" : "min-h-[220px]"
      }`}
    >
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="text-lg font-semibold text-white">{item.title}</div>
      </div>
    </div>
  );
}

export default function TournamentHighlights() {
  return (
    <section className="space-y-8">
      {/* Title Sponsor */}
      <div className="overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-r from-sky-600/15 via-slate-950 to-cyan-500/10 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              <ShieldCheck size={14} />
              {tournamentData.sponsor.title}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              {tournamentData.sponsor.name}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {tournamentData.sponsor.description}
            </p>
          </div>

          <div className="rounded-2xl border border-sky-400/20 bg-slate-900/70 px-5 py-4 text-center">
            <div className="text-xs uppercase tracking-[0.18em] text-sky-300">
              Official Partner
            </div>
            <div className="mt-2 text-lg font-bold text-white">
              Puia Premier League 2026
            </div>
          </div>
        </div>
      </div>

      {/* Champions & Runners-up */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TeamHonorCard team={tournamentData.champions} isChampion={true} />
        <TeamHonorCard team={tournamentData.runnersUp} />
      </div>

      {/* Stats */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Tournament Stats</h2>
          <p className="mt-1 text-sm text-slate-400">
            Final overview of the completed season.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tournamentData.stats.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </div>
      </div>

      {/* Tournament Committee */}
      {/* <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-white">
            Tournament Committee
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Official organizing committee of the tournament.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tournamentData.committee.map((member) => (
            <CommitteeCard key={member.name} member={member} />
          ))}
        </div>
      </div> */}

      {/* Gallery */}
      {/* <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white">Gallery</h2>
            <p className="mt-1 text-sm text-slate-400">
              Memorable moments from the tournament.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
            <Camera size={14} />
            Tournament Photos
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GalleryCard item={tournamentData.gallery[0]} featured />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <GalleryCard item={tournamentData.gallery[1]} />
            <GalleryCard item={tournamentData.gallery[2]} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
            <GalleryCard item={tournamentData.gallery[3]} />
            <GalleryCard item={tournamentData.gallery[4]} />
            <GalleryCard item={tournamentData.gallery[5]} />
          </div>
        </div>
      </div> */}

      {/* Thank You */}
      <div className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-slate-950 to-teal-500/10 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              <HeartHandshake size={14} />
              Appreciation
            </div>

            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              {tournamentData.thankYou.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {tournamentData.thankYou.description}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-slate-900/70 px-5 py-4 text-center">
            <div className="text-xs uppercase tracking-[0.18em] text-emerald-300">
              Gratitude
            </div>
            <div className="mt-2 text-lg font-bold text-white">
              See You Next Season
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
