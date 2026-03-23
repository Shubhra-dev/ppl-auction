import { BadgeCheck, Shield, Users, Star } from "lucide-react";

const advisoryBoard = [
  { name: "Kamruzzaman Rocky", role: "Advisor" },
  { name: "Shanto Islam", role: "Advisor" },
  { name: "Malekuzzaman Polash", role: "Advisor" },
];

const committeeMembers = [
  { name: "Suman Kumar Mondol", role: "President", level: "top" },
  { name: "Krishna Kumar", role: "Vice President", level: "top" },
  { name: "Suman Kumar (MLA)", role: "General Secretary", level: "top" },
  { name: "Sagar Kumar", role: "Joint General Secretary", level: "mid" },
  { name: "Suman Kumar (MP)", role: "Organizing Secretary", level: "mid" },
  { name: "Abu Sayeed", role: "Joint Organizing Secretary", level: "mid" },
  { name: "Imran Kayes", role: "Finance Secretary", level: "mid" },
  { name: "Raihan Kabir", role: "Co-Finance Secretary", level: "mid" },
  { name: "Abdul Aziz (Hero)", role: "Office Secretary", level: "mid" },
  { name: "M. D. Shanto", role: "Joint Office Secretary", level: "mid" },
  { name: "Hafizur Rahman (Sohag)", role: "Publicity Secretary", level: "mid" },
  { name: "Mokaddes Shah", role: "Joint Publicity Secretary", level: "mid" },
  //   { name: "All Board Members", role: "Members", level: "base" },
];

function SectionHeader({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
        <Icon size={14} />
        {eyebrow}
      </div>

      <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function AdvisorCard({ member }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-slate-900 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
      <div className="absolute right-4 top-4 text-cyan-300/20">
        <Star size={42} />
      </div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
          <BadgeCheck size={13} />
          Advisory Board
        </div>

        <h3 className="mt-4 text-lg font-bold text-white">{member.name}</h3>
        <p className="mt-1 text-sm text-slate-300">{member.role}</p>
      </div>
    </div>
  );
}

function LeadershipCard({ member, featured = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 ${
        featured
          ? "border-amber-400/25 bg-gradient-to-br from-amber-500/15 via-slate-950 to-slate-900 shadow-[0_20px_70px_rgba(250,204,21,0.12)]"
          : "border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-[0_14px_40px_rgba(0,0,0,0.18)]"
      }`}
    >
      {featured ? (
        <>
          <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.12),transparent_42%)]" />
        </>
      ) : null}

      <div className="relative z-10">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            featured
              ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
              : "border-slate-700 bg-slate-800 text-slate-300"
          }`}
        >
          <Shield size={13} />
          {member.role}
        </div>

        <h3 className="mt-5 text-xl font-bold text-white sm:text-2xl">
          {member.name}
        </h3>

        <div className="mt-3 text-sm leading-6 text-slate-400">
          {featured
            ? "Top-level tournament leadership responsible for direction, governance, and official oversight."
            : "Core leadership role within the official tournament committee structure."}
        </div>
      </div>
    </div>
  );
}

function CommitteeCard({ member }) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition duration-300 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{member.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{member.role}</p>
        </div>

        <div className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">
          Committee
        </div>
      </div>
    </div>
  );
}

function MembersFooterCard({ member }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Extended Body
          </div>
          <div className="mt-2 text-xl font-bold text-white">{member.name}</div>
          <div className="mt-1 text-sm text-slate-400">{member.role}</div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300">
          <Users size={15} />
          Official Tournament Body
        </div>
      </div>
    </div>
  );
}

export default function TournamentCommitteeSection() {
  const president = committeeMembers.find((m) => m.role === "President");
  const vicePresident = committeeMembers.find(
    (m) => m.role === "Vice President",
  );
  const generalSecretary = committeeMembers.find(
    (m) => m.role === "General Secretary",
  );

  const otherCommitteeMembers = committeeMembers.filter(
    (m) =>
      !["President", "Vice President", "General Secretary", "Members"].includes(
        m.role,
      ),
  );

  const membersFooter = committeeMembers.find((m) => m.role === "Members");

  return (
    <section className="space-y-8">
      {/* Tournament Committee */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <SectionHeader
          eyebrow="Official Body"
          title="Tournament Committee"
          description="The official organizing committee responsible for tournament planning, match operations, coordination, communication, finance, and overall event execution."
          icon={Shield}
        />

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {president ? <LeadershipCard member={president} featured /> : null}
          </div>

          <div className="grid gap-5 lg:col-span-7 sm:grid-cols-2">
            {vicePresident ? <LeadershipCard member={vicePresident} /> : null}
            {generalSecretary ? (
              <LeadershipCard member={generalSecretary} />
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {otherCommitteeMembers.map((member) => (
            <CommitteeCard
              key={`${member.name}-${member.role}`}
              member={member}
            />
          ))}
        </div>

        {membersFooter ? (
          <div className="mt-6">
            <MembersFooterCard member={membersFooter} />
          </div>
        ) : null}
      </div>
      {/* Advisory Board */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <SectionHeader
          eyebrow="Governance"
          title="Advisory Board"
          description="The advisory board provides guidance, strategic support, and senior oversight to the tournament committee."
          icon={Star}
        />

        <div className="grid gap-4 md:grid-cols-3">
          {advisoryBoard.map((member) => (
            <AdvisorCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
