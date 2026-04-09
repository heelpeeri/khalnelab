import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

const turnBasedGames = [
  {
    href: "/match?game=word",
    emoji: "💬",
    title: "خمن الكلمة",
    desc: "خمن الكلمة بحروف عربية",
    tag: "WORD",
  },
  {
    href: "/match?game=categories",
    emoji: "🌍",
    title: "إنسان حيوان نبات جماد بلاد",
    desc: "المعروف لا يعرف",
    tag: "CATEGORIES",
  },
  {
    href: "/match?game=wheel",
    emoji: "🎡",
    title: "لف وخمن",
    desc: "لف العجلة وجرب حظك 😏",
    tag: "WHEEL",
  },
];

const speedGames = [
  {
    href: "/match?game=draw",
    emoji: "✏️",
    title: "خمن المثل",
    desc: "خمن المثل من الإيموجي",
    tag: "EMOJI",
  },
  {
    href: "/match?game=scramble",
    emoji: "🧩",
    title: "حروف بالخلاط",
    desc: "حروف ملخبطة؟ رتبها!",
    tag: "SCRAMBLE",
  },
];

function GameCard({
  href,
  emoji,
  title,
  desc,
  tag,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-6 text-right transition duration-200 hover:-translate-y-1 hover:border-pink-300/30 hover:bg-white/14 hover:shadow-[0_0_24px_rgba(255,0,153,0.14)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_35%)] opacity-80" />

        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-black tracking-[0.18em] text-cyan-200">
              {tag}
            </span>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/12 text-3xl shadow-[0_0_18px_rgba(255,255,255,0.05)]">
              {emoji}
            </div>
          </div>

          <h3 className="text-2xl font-black text-white transition group-hover:text-[#98ffb6]">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-7 text-white/75 md:text-base">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-center">
          <div className="drop-shadow-[0_0_20px_rgba(255,80,180,0.22)]">
            <Logo size={210} />
          </div>
        </div>

        <section className="mx-auto mt-6 max-w-4xl text-center">
          <p className="text-sm font-black tracking-[0.28em] text-cyan-300/80">
            1 UP
          </p>

          <h1 className="mt-3 text-5xl font-black text-[#98ffb6] drop-shadow-[0_0_16px_rgba(152,255,182,0.28)] md:text-7xl">
            خل نلعب
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/80 md:text-2xl">
            ألعاب جلسات سريعة، تنافس، وضحك داخل البيت.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/match?game=word" className="btn-primary min-w-[180px] active:scale-95">
              START
            </Link>

            <Link href="/match?game=wheel" className="btn-secondary min-w-[180px] active:scale-95">
              QUICK PLAY
            </Link>
          </div>
        </section>

        <section className="mt-14 grid gap-8 xl:grid-cols-2">
          <GlassCard className="rounded-[32px] p-7 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-right">
                <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
                  SELECT MODE
                </p>
                <h2 className="mt-1 text-3xl font-black text-white md:text-4xl">
                  دور دور
                </h2>
                <p className="mt-2 text-sm leading-7 text-white/70 md:text-base">
                  ألعاب تعتمد على الأدوار والتركيز والتحدي الهادي.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/15 text-3xl shadow-[0_0_18px_rgba(255,255,255,0.06)]">
                🎯
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {turnBasedGames.map((game) => (
                <GameCard key={game.title} {...game} />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="rounded-[32px] p-7 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-right">
                <p className="text-sm font-black tracking-[0.18em] text-pink-300/80">
                  SPEED MODE
                </p>
                <h2 className="mt-1 text-3xl font-black text-white md:text-4xl">
                  أسرع واحد يفوز
                </h2>
                <p className="mt-2 text-sm leading-7 text-white/70 md:text-base">
                  هنا السرعة تفرق، واللي يتردد يطيح.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/15 text-3xl shadow-[0_0_18px_rgba(255,255,255,0.06)]">
                ⚡
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {speedGames.map((game) => (
                <GameCard key={game.title} {...game} />
              ))}
            </div>
          </GlassCard>
        </section>

        <section className="mt-10 flex flex-wrap items-center justify-center gap-3 text-center">
          <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black tracking-[0.2em] text-yellow-200">
            START
          </div>
          <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black tracking-[0.2em] text-pink-200">
            FAMILY MODE
          </div>
          <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black tracking-[0.2em] text-cyan-200">
            1 UP
          </div>
        </section>
      </div>
    </main>
  );
}
