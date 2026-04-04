import Link from "next/link";
import { Logo } from "@/components/Logo";

const games = [
  {
    href: "/match?game=word",
    label: "خمن الكلمة",
    tag: "WORD",
  },
  {
    href: "/match?game=wheel",
    label: "لف وخمن",
    tag: "WHEEL",
  },
  {
    href: "/match?game=draw",
    label: "خمن المثل",
    tag: "EMOJI",
  },
  {
    href: "/match?game=scramble",
    label: "حروف بالخلاط",
    tag: "SCRAMBLE",
  },
  {
    href: "/match?game=categories",
    label: "إنسان حيوان نبات جماد بلاد",
    tag: "CATEGORIES",
  },
];

function PixelStars() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[#120021]" />

      <div className="pointer-events-none absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_15%_20%,#22d3ee_2px,transparent_2px),radial-gradient(circle_at_35%_60%,#f59e0b_2px,transparent_2px),radial-gradient(circle_at_80%_30%,#ec4899_2px,transparent_2px),radial-gradient(circle_at_70%_80%,#22d3ee_2px,transparent_2px),radial-gradient(circle_at_55%_18%,#facc15_2px,transparent_2px),radial-gradient(circle_at_25%_85%,#a855f7_2px,transparent_2px)] [background-size:320px_320px]" />

      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-[linear-gradient(to_top,rgba(74,0,140,0.75),transparent)]" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 opacity-70 [clip-path:polygon(0_100%,0_55%,12%_72%,24%_48%,35%_68%,48%_38%,60%_62%,73%_35%,85%_58%,100%_30%,100%_100%)] bg-[#2a0066]" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 opacity-90 [clip-path:polygon(0_100%,0_68%,10%_82%,21%_60%,33%_78%,47%_56%,61%_74%,76%_51%,88%_71%,100%_59%,100%_100%)] bg-[#4c1d95]" />
    </>
  );
}

function PixelTitle() {
  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <div className="drop-shadow-[0_0_18px_rgba(255,100,200,0.35)]">
          <Logo size={140} />
        </div>
      </div>

      <h1
        className="text-center text-6xl font-black leading-none tracking-tight text-[#39ffb6] md:text-8xl"
        style={{
          textShadow:
            "4px 4px 0 #3b0764, 8px 8px 0 rgba(0,0,0,0.35), 0 0 18px rgba(57,255,182,0.28)",
        }}
      >
        خل نلعب
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-xl">
        ألعاب جلسات سريعة، تنافس، وضحك داخل البيت.
      </p>
    </div>
  );
}

function StartButton() {
  return (
    <Link
      href="/match?game=word"
      className="inline-flex min-w-[240px] items-center justify-center border-4 border-[#ffd84d] bg-[#ff5c39] px-10 py-4 text-2xl font-black text-white shadow-[0_0_0_3px_#7c2d12,0_10px_0_#7c2d12,0_0_28px_rgba(255,110,60,0.45)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-[0_0_0_3px_#7c2d12,0_4px_0_#7c2d12,0_0_20px_rgba(255,110,60,0.35)]"
      style={{
        clipPath:
          "polygon(6% 0,94% 0,100% 18%,100% 82%,94% 100%,6% 100%,0 82%,0 18%)",
      }}
    >
      ابدأ اللعب
    </Link>
  );
}

function GameMode({
  href,
  label,
  tag,
}: {
  href: string;
  label: string;
  tag: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="group border-2 border-[#ff5ccf]/40 bg-[#2a003d]/85 px-4 py-4 text-right shadow-[0_0_0_2px_rgba(255,255,255,0.04),0_0_18px_rgba(255,0,153,0.12)] transition hover:-translate-y-1 hover:border-[#39ffb6]/50 hover:bg-[#33004a] hover:shadow-[0_0_0_2px_rgba(255,255,255,0.06),0_0_24px_rgba(57,255,182,0.16)]">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-black tracking-[0.2em] text-[#ffd84d]">
            {tag}
          </span>
          <span className="text-lg font-black text-white md:text-2xl">
            {label}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 text-white">
      <PixelStars />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center">
        <PixelTitle />

        <div className="mt-10">
          <StartButton />
        </div>

        <div className="mt-12 w-full max-w-4xl border-2 border-[#8b5cf6]/40 bg-[#180028]/75 p-4 shadow-[0_0_28px_rgba(139,92,246,0.18)] backdrop-blur-sm md:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm font-black tracking-[0.25em] text-[#22d3ee]">
              SELECT MODE
            </p>
            <p className="text-sm font-bold text-white/60">اختر اللعبة</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {games.map((game) => (
              <GameMode
                key={game.href}
                href={game.href}
                label={game.label}
                tag={game.tag}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
          <div className="border border-[#22d3ee]/40 bg-[#001b2a]/70 px-4 py-2 text-[#67e8f9]">
            1 UP
          </div>
          <div className="border border-[#f472b6]/40 bg-[#2a0017]/70 px-4 py-2 text-[#f9a8d4]">
            FAMILY MODE
          </div>
          <div className="border border-[#facc15]/40 bg-[#2b2100]/70 px-4 py-2 text-[#fde047]">
            START
          </div>
        </div>
      </div>
    </main>
  );
}
