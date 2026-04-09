'use client';

import Link from "next/link";
import { Logo } from "@/components/Logo";

const games = [
  {
    href: "/match?game=word",
    emoji: "💬",
    title: "خمن الكلمة",
    desc: "خمن الكلمة بحروف عربية",
    tag: "WORD",
  },
  {
    href: "/match?game=wheel",
    emoji: "🎡",
    title: "لف وخمن",
    desc: "لف العجلة وجرب حظك",
    tag: "WHEEL",
  },
  {
    href: "/match?game=scramble",
    emoji: "🧩",
    title: "حروف بالخلاط",
    desc: "رتب الحروف بسرعة",
    tag: "SCRAMBLE",
  },
  {
    href: "/match?game=draw",
    emoji: "✏️",
    title: "خمن المثل",
    desc: "خمن المثل من الإيموجي",
    tag: "EMOJI",
  },
  {
    href: "/match?game=categories",
    emoji: "🌍",
    title: "إنسان حيوان نبات جماد بلاد",
    desc: "فكر بسرعة وجاوب",
    tag: "CATEGORIES",
  },
];

export default function Home() {
  return (
    <main className="crt-screen crt-flicker relative min-h-screen overflow-hidden px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage: `
              radial-gradient(circle at 8% 12%, rgba(0,255,255,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 14% 24%, rgba(255,196,0,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 22% 9%, rgba(255,130,220,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 31% 18%, rgba(0,220,255,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 39% 11%, rgba(255,196,0,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 48% 16%, rgba(255,130,220,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 59% 10%, rgba(0,255,255,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 71% 15%, rgba(255,196,0,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 82% 9%, rgba(255,130,220,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 93% 14%, rgba(0,255,255,0.95) 0 2px, transparent 3px),

              radial-gradient(circle at 6% 64%, rgba(0,255,255,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 15% 73%, rgba(255,130,220,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 23% 82%, rgba(0,220,255,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 34% 70%, rgba(255,196,0,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 44% 78%, rgba(255,130,220,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 56% 67%, rgba(0,255,255,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 68% 80%, rgba(255,196,0,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 79% 72%, rgba(255,130,220,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 88% 84%, rgba(0,255,255,0.95) 0 2px, transparent 3px),
              radial-gradient(circle at 96% 69%, rgba(255,196,0,0.95) 0 2px, transparent 3px)
            `,
          }}
        />

        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 48%, rgba(0,255,255,0.9) 48%, rgba(0,255,255,0.9) 52%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, rgba(0,255,255,0.9) 48%, rgba(0,255,255,0.9) 52%, transparent 52%),
              linear-gradient(45deg, transparent 48%, rgba(255,196,0,0.9) 48%, rgba(255,196,0,0.9) 52%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, rgba(255,196,0,0.9) 48%, rgba(255,196,0,0.9) 52%, transparent 52%),
              linear-gradient(45deg, transparent 48%, rgba(255,130,220,0.9) 48%, rgba(255,130,220,0.9) 52%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, rgba(255,130,220,0.9) 48%, rgba(255,130,220,0.9) 52%, transparent 52%)
            `,
            backgroundSize: "18px 18px, 18px 18px, 20px 20px, 20px 20px, 16px 16px, 16px 16px",
            backgroundPosition:
              "10% 20%, 10% 20%, 78% 12%, 78% 12%, 90% 78%, 90% 78%",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="flex justify-center">
          <Logo size={160} />
        </div>

        <section className="intro mt-6 text-center">
          <h1
            className="text-5xl font-black tracking-wider text-transparent md:text-6xl"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #ffffff 0%, #f2f2f2 35%, #b7d5ff 70%, #5b8dff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              textShadow: "0 0 20px rgba(152,255,182,0.2)",
            }}
          >
            خل نلعب
          </h1>

          <p className="mt-3 text-lg text-white/85 md:text-xl">
            ألعاب جلسات سريعة، تنافس، وضحك داخل البيت.
          </p>

          <Link
            href="/match?game=word"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-10 py-3 font-black shadow-[0_0_25px_rgba(255,120,0,0.5)] transition hover:scale-105 active:scale-95"
          >
            ابدأ اللعب
          </Link>
        </section>

        <section className="mt-12">
          <div className="rounded-[28px] border border-pink-400/40 bg-[#120020]/90 p-6 shadow-[0_0_50px_rgba(255,0,150,0.25)]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white/90">اختر اللعبة</h2>
              <span className="text-sm tracking-widest text-cyan-300">
                SELECT MODE
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {games.map((game) => (
                <Link key={game.title} href={game.href}>
                  <div className="group relative rounded-2xl border border-pink-400/40 bg-[#1a0030] p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,0,150,0.35)]">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-cyan-400/10 opacity-0 transition group-hover:opacity-100" />

                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <div className="text-right">
                        <h3 className="text-xl font-black text-white">
                          {game.title}
                        </h3>

                        <p className="mt-1 text-sm text-white/70">
                          {game.desc}
                        </p>

                        <span className="mt-2 block text-xs tracking-widest text-yellow-300">
                          {game.tag}
                        </span>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-2xl shadow-[0_0_12px_rgba(255,255,255,0.1)]">
                        {game.emoji}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 flex justify-center gap-3 text-xs font-black tracking-widest">
          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-cyan-200">
            1 UP
          </span>
          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-pink-200">
            FAMILY MODE
          </span>
          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-yellow-200">
            START
          </span>
        </section>
      </div>
    </main>
  );
}
