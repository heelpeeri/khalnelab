'use client';

import Link from "next/link";
import { Logo } from "@/components/Logo";

const games = [
  {
    href: "/match?game=word",
    emoji: "💬",
    title: "خمن الكلمة",
    desc: "خمن الكلمة بحروف عربية",
    tag: "WORD"
  },
  {
    href: "/match?game=wheel",
    emoji: "🎡",
    title: "لف وخمن",
    desc: "لف العجلة وجرب حظك",
    tag: "WHEEL"
  },
  {
    href: "/match?game=scramble",
    emoji: "🧩",
    title: "حروف بالخلاط",
    desc: "رتب الحروف بسرعة",
    tag: "SCRAMBLE"
  },
  {
    href: "/match?game=draw",
    emoji: "✏️",
    title: "خمن المثل",
    desc: "خمن المثل من الإيموجي",
    tag: "EMOJI"
  },
  {
    href: "/match?game=categories",
    emoji: "🌍",
    title: "إنسان حيوان نبات جماد بلاد",
    desc: "فكر بسرعة وجاوب",
    tag: "CATEGORIES"
  },
];

export default function Home() {
  return (
    <main className="crt-screen crt-flicker min-h-screen px-4 py-10 text-white">

      <div className="mx-auto max-w-6xl">

        {/* LOGO */}
        <div className="flex justify-center">
          <Logo size={160} />
        </div>

        {/* HERO */}
        <section className="intro mt-6 text-center">
          <h1 className="neon text-5xl font-black text-[#98ffb6] md:text-6xl">
            خل نلعب
          </h1>

          <p className="mt-3 text-lg text-white/80">
            ألعاب جلسات سريعة، تنافس، وضحك داخل البيت
          </p>

          <Link
            href="/match?game=word"
            className="btn-primary mt-6 inline-block"
          >
            ابدأ اللعب
          </Link>
        </section>

        {/* GAMES */}
        <section className="mt-12">
          <div className="rounded-[28px] border border-pink-400/40 bg-[#140021]/80 p-6 shadow-[0_0_40px_rgba(255,0,150,0.25)]">

            <div className="mb-6 flex justify-between">
              <h2 className="text-xl font-black">اختر اللعبة</h2>
              <span className="text-sm text-cyan-300">SELECT MODE</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {games.map((game) => (
                <Link key={game.title} href={game.href}>
                  <div className="group rounded-2xl border border-pink-400/30 bg-[#1b0030] p-5 transition hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,0,150,0.25)]">

                    <div className="flex items-center justify-between gap-4">

                      <div className="text-right">
                        <h3 className="text-xl font-black">
                          {game.title}
                        </h3>

                        <p className="mt-1 text-sm text-white/70">
                          {game.desc}
                        </p>

                        <span className="mt-2 block text-xs text-yellow-300">
                          {game.tag}
                        </span>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-2xl">
                        {game.emoji}
                      </div>

                    </div>

                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
