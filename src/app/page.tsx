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
    <main className="crt-screen crt-flicker relative min-h-screen px-4 py-10 text-white overflow-hidden">

      {/* 🎮 pixel background */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,0,150,0.25)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">

        {/* LOGO */}
        <div className="flex justify-center">
          <Logo size={160} />
        </div>

        {/* HERO */}
        <section className="intro mt-6 text-center">
          <h1 className="text-5xl font-black md:text-6xl tracking-wider
          bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-300
          bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,0,150,0.5)]">
            خل نلعب
          </h1>

          <p className="mt-3 text-lg text-white/80">
            ألعاب جلسات سريعة، تنافس، وضحك داخل البيت
          </p>

          <Link
            href="/match?game=word"
            className="mt-6 inline-block px-10 py-3 font-black rounded-xl
            bg-gradient-to-r from-orange-500 to-pink-500
            shadow-[0_0_25px_rgba(255,120,0,0.5)]
            hover:scale-105 active:scale-95 transition"
          >
            START
          </Link>
        </section>

        {/* GAMES */}
        <section className="mt-12">
          <div className="rounded-[28px] border border-pink-400/40 bg-[#120020]/90 p-6
          shadow-[0_0_50px_rgba(255,0,150,0.25)]">

            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-black text-white/90">
                اختر اللعبة
              </h2>
              <span className="text-sm text-cyan-300 tracking-widest">
                SELECT MODE
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {games.map((game) => (
                <Link key={game.title} href={game.href}>
                  <div className="group relative rounded-2xl border border-pink-400/40
                  bg-[#1a0030] p-5 transition duration-200
                  hover:-translate-y-1
                  hover:shadow-[0_0_30px_rgba(255,0,150,0.35)]">

                    {/* glow hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                    bg-gradient-to-r from-pink-500/10 to-cyan-400/10 transition" />

                    <div className="relative z-10 flex items-center justify-between gap-4">

                      <div className="text-right">
                        <h3 className="text-xl font-black text-white">
                          {game.title}
                        </h3>

                        <p className="mt-1 text-sm text-white/70">
                          {game.desc}
                        </p>

                        <span className="mt-2 block text-xs text-yellow-300 tracking-widest">
                          {game.tag}
                        </span>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center
                      rounded-xl bg-black/40 border border-white/10 text-2xl
                      shadow-[0_0_12px_rgba(255,255,255,0.1)]">
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
