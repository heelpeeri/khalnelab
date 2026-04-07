import Link from "next/link";
import { Logo } from "@/components/Logo";

const games = [
  {
    href: "/match?game=word",
    title: "خمن الكلمة",
    desc: "خمن الكلمة بحروف عربية",
    tag: "WORD",
    emoji: "💬",
  },
  {
    href: "/match?game=wheel",
    title: "لف وخمن",
    desc: "لف العجلة وجرب حظك",
    tag: "WHEEL",
    emoji: "🎡",
  },
  {
    href: "/match?game=draw",
    title: "خمن المثل",
    desc: "خمن المثل من الإيموجي",
    tag: "EMOJI",
    emoji: "✏️",
  },
  {
    href: "/match?game=scramble",
    title: "حروف بالخلاط",
    desc: "رتب الحروف قبل الوقت يخلص",
    tag: "SCRAMBLE",
    emoji: "🧩",
  },
  {
    href: "/match?game=categories",
    title: "إنسان حيوان نبات جماد بلاد",
    desc: "الكل يفكر بسرعة ويجاوب",
    tag: "CATEGORIES",
    emoji: "🌍",
  },
];

function ArcadeBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(80,255,180,0.18),_transparent_18%),linear-gradient(180deg,_#0c001d_0%,_#170028_35%,_#2d0030_70%,_#3b001a_100%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_10%_15%,#22d3ee_2px,transparent_2px),radial-gradient(circle_at_20%_70%,#facc15_2px,transparent_2px),radial-gradient(circle_at_35%_30%,#f472b6_2px,transparent_2px),radial-gradient(circle_at_48%_85%,#22d3ee_2px,transparent_2px),radial-gradient(circle_at_63%_18%,#fde047_2px,transparent_2px),radial-gradient(circle_at_76%_60%,#a855f7_2px,transparent_2px),radial-gradient(circle_at_90%_25%,#38bdf8_2px,transparent_2px),radial-gradient(circle_at_88%_82%,#f59e0b_2px,transparent_2px)] [background-size:300px_300px]" />

      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(to_top,rgba(91,33,182,0.4),transparent)]" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 opacity-80 [clip-path:polygon(0_100%,0_70%,12%_82%,22%_62%,35%_78%,46%_55%,58%_73%,70%_52%,83%_69%,100%_45%,100%_100%)] bg-[#2c0a66]" />
    </>
  );
}

function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
      <div className="drop-shadow-[0_0_20px_rgba(255,120,220,0.35)]">
        <Logo size={130} />
      </div>

      <h1
        className="mt-6 text-6xl font-black leading-none text-[#98ffb6] md:text-8xl"
        style={{
          textShadow:
            "4px 4px 0 #2b124a, 8px 8px 0 rgba(0,0,0,0.35), 0 0 22px rgba(152,255,182,0.35)",
        }}
      >
        خل نلعب
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85 md:text-2xl">
        ألعاب جلسات سريعة، تنافس، وضحك داخل البيت.
      </p>

      <div className="mt-8">
        <Link
          href="/match?game=word"
          className="inline-flex min-w-[250px] items-center justify-center border-4 border-[#ffd84d] bg-[#ff6a3c] px-10 py-4 text-2xl font-black text-white shadow-[0_0_0_3px_#7c2d12,0_10px_0_#7c2d12,0_0_28px_rgba(255,110,60,0.4)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-[0_0_0_3px_#7c2d12,0_4px_0_#7c2d12,0_0_18px_rgba(255,110,60,0.28)]"
          style={{
            clipPath:
              "polygon(6% 0,94% 0,100% 18%,100% 82%,94% 100%,6% 100%,0 82%,0 18%)",
          }}
        >
          ابدأ اللعب
        </Link>
      </div>
    </section>
  );
}

function GameCard({
  href,
  title,
  desc,
  tag,
  emoji,
}: {
  href: string;
  title: string;
  desc: string;
  tag: string;
  emoji: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="group relative overflow-hidden border-2 border-[#ff4fd8]/35 bg-[#220032]/80 p-5 shadow-[0_0_0_2px_rgba(255,255,255,0.03),0_0_18px_rgba(255,0,140,0.14)] transition duration-200 hover:-translate-y-1 hover:border-[#69fff1]/50 hover:bg-[#2b003f] hover:shadow-[0_0_0_2px_rgba(255,255,255,0.05),0_0_24px_rgba(80,255,220,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.07),_transparent_35%)] opacity-0 transition group-hover:opacity-100" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/15 bg-white/10 text-3xl shadow-[0_0_14px_rgba(255,255,255,0.08)]">
            {emoji}
          </div>

          <div className="min-w-0 flex-1 text-right">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black tracking-[0.22em] text-[#fde047]">
                {tag}
              </span>
              <h3 className="text-2xl font-black text-white">{title}</h3>
            </div>

            <p className="mt-3 text-sm leading-7 text-white/75 md:text-base">
              {desc}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ModePanel() {
  return (
    <section className="mx-auto mt-14 w-full max-w-5xl">
      <div className="border-2 border-[#8b5cf6]/40 bg-[#160025]/75 p-4 shadow-[0_0_26px_rgba(139,92,246,0.18)] backdrop-blur-sm md:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm font-black tracking-[0.25em] text-[#67e8f9]">
            SELECT MODE
          </p>
          <p className="text-sm font-bold text-white/65">اختر اللعبة</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {games.map((game) => (
            <GameCard
              key={game.href}
              href={game.href}
              title={game.title}
              desc={game.desc}
              tag={game.tag}
              emoji={game.emoji}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterBadges() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-black">
      <div className="border border-[#fde047]/35 bg-[#2f2200]/70 px-4 py-2 text-[#fde047]">
        START
      </div>
      <div className="border border-[#f472b6]/35 bg-[#2a0018]/70 px-4 py-2 text-[#f9a8d4]">
        FAMILY MODE
      </div>
      <div className="border border-[#67e8f9]/35 bg-[#001d29]/70 px-4 py-2 text-[#67e8f9]">
        1 UP
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 text-white">
      <ArcadeBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center py-10">
        <Hero />
        <ModePanel />
        <FooterBadges />
      </div>
    </main>
  );
}
