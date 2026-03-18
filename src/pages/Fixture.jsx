import { useMemo } from "react";

const teams = [
  {
    id: "5834315f-acaa-4401-b94a-54f64e8a803b",
    name: "PPL Riders",
    short_name: "Riders",
    logo_url:
      "https://nndigctjfwmlnypdsedu.supabase.co/storage/v1/object/public/ppl-assets/teams/1772629022950-adcf5f1e-bb4e-4091-86a1-7d234dd10dd6-ppl-riders.png",
    group: "B",
  },
  {
    id: "af6070d1-5e45-47f6-b0e4-2a0aee9f210f",
    name: "PPL Lions",
    short_name: "Lions",
    logo_url:
      "https://nndigctjfwmlnypdsedu.supabase.co/storage/v1/object/public/ppl-assets/teams/1772629088052-13d171c1-e989-4c83-8390-c537593bb031-02oct24-anis-free-upload-.png",
    group: "A",
  },
  {
    id: "b8bd287c-1a28-4390-a635-f0c54820ede7",
    name: "PPL Challengers",
    short_name: "Challengers",
    logo_url:
      "https://nndigctjfwmlnypdsedu.supabase.co/storage/v1/object/public/ppl-assets/teams/1772629112324-25a21893-a51c-44ac-9946-369b9a3d2448-ppl-challengers.png",
    group: "B",
  },
  {
    id: "893a97a3-a679-4749-923e-ef3c2d81e791",
    name: "PPL Dragons",
    short_name: "Dragons",
    logo_url:
      "https://nndigctjfwmlnypdsedu.supabase.co/storage/v1/object/public/ppl-assets/teams/1772629139933-4cab4bd3-5683-4cb0-bd51-1cc9ca92ba99-ppl-dragons.png",
    group: "A",
  },
  {
    id: "b8fb8aba-a7eb-4060-a7b6-88b24a253f54",
    name: "PPL Eagles",
    short_name: "Eagles",
    logo_url:
      "https://nndigctjfwmlnypdsedu.supabase.co/storage/v1/object/public/ppl-assets/teams/1772629167668-2748daf6-874f-4c60-9fd6-1d93c76b441d-ppl-eagles.png",
    group: "B",
  },
  {
    id: "eb0db3e7-7be3-419a-963a-09167cc1a6a1",
    name: "PPL Tigers",
    short_name: "Tigers",
    logo_url:
      "https://nndigctjfwmlnypdsedu.supabase.co/storage/v1/object/public/ppl-assets/teams/1772641351744-9f260c37-37e7-45db-a891-0d2ef92c5b28-whatsapp-image-2026-03-04-at-1.55.00-am.jpeg",
    group: "A",
  },
];

const teamByName = Object.fromEntries(teams.map((t) => [t.name, t]));

const fixtures = [
  {
    match_no: 1,
    stage: "Group Stage",
    group: "A",
    team1: teamByName["PPL Lions"],
    team2: teamByName["PPL Tigers"],
    date: "22 Mar 2026",
    time: "3:00 PM",
    venue: "Puia School Field",
  },
  {
    match_no: 2,
    stage: "Group Stage",
    group: "B",
    team1: teamByName["PPL Challengers"],
    team2: teamByName["PPL Riders"],
    date: "22 Mar 2026",
    time: "3:50 PM",
    venue: "Puia School Field",
  },
  {
    match_no: 3,
    stage: "Group Stage",
    group: "A",
    team1: teamByName["PPL Lions"],
    team2: teamByName["PPL Dragons"],
    date: "22 Mar 2026",
    time: "4:40 PM",
    venue: "Puia School Field",
  },
  {
    match_no: 4,
    stage: "Group Stage",
    group: "B",
    team1: teamByName["PPL Challengers"],
    team2: teamByName["PPL Eagles"],
    date: "22 Mar 2026",
    time: "5:30 PM",
    venue: "Puia School Field",
  },
  {
    match_no: 5,
    stage: "Group Stage",
    group: "A",
    team1: teamByName["PPL Tigers"],
    team2: teamByName["PPL Dragons"],
    date: "22 Mar 2026",
    time: "6:20 PM",
    venue: "Puia School Field",
  },
  {
    match_no: 6,
    stage: "Group Stage",
    group: "B",
    team1: teamByName["PPL Riders"],
    team2: teamByName["PPL Eagles"],
    date: "22 Mar 2026",
    time: "7:10 PM",
    venue: "Puia School Field",
  },
  {
    match_no: 7,
    stage: "Semi Final",
    group: null,
    team1: {
      id: "group-a-champion",
      name: "Group A Champion",
      short_name: "A1",
      logo_url: "",
    },
    team2: {
      id: "group-b-runner-up",
      name: "Group B Runner-up",
      short_name: "B2",
      logo_url: "",
    },
    date: "22 Mar 2026",
    time: "8:00 PM",
    venue: "Puia School Field",
  },
  {
    match_no: 8,
    stage: "Semi Final",
    group: null,
    team1: {
      id: "group-b-champion",
      name: "Group B Champion",
      short_name: "B1",
      logo_url: "",
    },
    team2: {
      id: "group-a-runner-up",
      name: "Group A Runner-up",
      short_name: "A2",
      logo_url: "",
    },
    date: "22 Mar 2026",
    time: "8:50 PM",
    venue: "Puia School Field",
  },
  {
    match_no: 9,
    stage: "Final",
    group: null,
    team1: {
      id: "winner-match-7",
      name: "Winner Match 7",
      short_name: "W7",
      logo_url: "",
    },
    team2: {
      id: "winner-match-8",
      name: "Winner Match 8",
      short_name: "W8",
      logo_url: "",
    },
    date: "22 Mar 2026",
    time: "9:40 PM",
    venue: "Puia School Field",
  },
];

function StageBadge({ stage, group }) {
  const style =
    stage === "Final"
      ? "bg-amber-500/15 text-amber-300 border-amber-400/30"
      : stage === "Semi Final"
        ? "bg-purple-500/15 text-purple-300 border-purple-400/30"
        : "bg-sky-500/15 text-sky-300 border-sky-400/30";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${style}`}
    >
      <span>{stage}</span>
      {group ? <span className="opacity-80">• Group {group}</span> : null}
    </div>
  );
}

function TeamPill({ team, align = "left" }) {
  const isPlaceholder = !team.logo_url;

  return (
    <div
      className={`flex items-center gap-3 ${
        align === "right" ? "justify-end text-right" : "justify-start text-left"
      }`}
    >
      {align === "right" ? (
        <>
          <div>
            <div className="text-sm font-semibold text-white">{team.name}</div>
            <div className="text-xs text-slate-400">{team.short_name}</div>
          </div>

          {isPlaceholder ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-slate-600 bg-slate-800 text-xs font-bold text-slate-300">
              {team.short_name}
            </div>
          ) : (
            <img
              src={team.logo_url}
              alt={team.name}
              className="h-12 w-12 rounded-full border border-slate-700 bg-white object-cover p-1"
            />
          )}
        </>
      ) : (
        <>
          {isPlaceholder ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-slate-600 bg-slate-800 text-xs font-bold text-slate-300">
              {team.short_name}
            </div>
          ) : (
            <img
              src={team.logo_url}
              alt={team.name}
              className="h-12 w-12 rounded-full border border-slate-700 bg-white object-cover p-1"
            />
          )}

          <div>
            <div className="text-sm font-semibold text-white">{team.name}</div>
            <div className="text-xs text-slate-400">{team.short_name}</div>
          </div>
        </>
      )}
    </div>
  );
}

function FixtureCard({ match }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-white">
            {match.match_no}
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Match {match.match_no}
            </div>
            <div className="mt-1">
              <StageBadge stage={match.stage} group={match.group} />
            </div>
          </div>
        </div>

        <div className="text-right text-sm">
          <div className="font-semibold text-white">{match.date}</div>
          <div className="text-slate-300">{match.time}</div>
          <div className="text-xs text-slate-500">{match.venue}</div>
        </div>
      </div>

      <div className="grid gap-4 px-4 py-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <TeamPill team={match.team1} />

        <div className="flex items-center justify-center">
          <div className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
            VS
          </div>
        </div>

        <TeamPill team={match.team2} align="right" />
      </div>
    </div>
  );
}

export default function Fixture() {
  const groupA = useMemo(() => teams.filter((team) => team.group === "A"), []);
  const groupB = useMemo(() => teams.filter((team) => team.group === "B"), []);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="border-b border-slate-800 px-5 py-6 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
            Tournament Fixture
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            PPL Tournament 2026
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Official match schedule for 22 March 2026. Matches will start from
            2:00 PM.
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Group A</h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                3 Teams
              </span>
            </div>

            <div className="space-y-3">
              {groupA.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <img
                    src={team.logo_url}
                    alt={team.name}
                    className="h-12 w-12 rounded-full border border-slate-700 bg-white object-cover p-1"
                  />
                  <div>
                    <div className="font-semibold text-white">{team.name}</div>
                    {/* <div className="text-xs text-slate-400">
                      Group A Participant
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Group B</h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                3 Teams
              </span>
            </div>

            <div className="space-y-3">
              {groupB.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <img
                    src={team.logo_url}
                    alt={team.name}
                    className="h-12 w-12 rounded-full border border-slate-700 bg-white object-cover p-1"
                  />
                  <div>
                    <div className="font-semibold text-white">{team.name}</div>
                    {/* <div className="text-xs text-slate-400">
                      Group B Participant
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">Match Schedule</h2>
            <p className="text-sm text-slate-400">
              With time, date, and teams.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {fixtures.map((match) => (
            <FixtureCard key={match.match_no} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
}
