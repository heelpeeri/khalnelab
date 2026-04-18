'use client';

import Link from "next/link";
import { Logo } from "@/components/Logo";

const quickGames = [
  {
    href: "/match?mode=quick&game=word",
    emoji: "💬",
    title: "خمن الكلمة",
    desc: "خمن الكلمة بحروف عربية",
    tag: "WORD",
  },
  {
    href: "/match?mode=quick&game=wheel",
    emoji: "🎡",
    title: "لف وخمن",
    desc: "لف العجلة وجرب حظك",
    tag: "WHEEL",
  },
  {
    href: "/match?mode=quick&game=scramble",
    emoji: "🧩",
    title: "حروف بالخلاط",
    desc: "رتب الحروف بسرعة",
    tag: "SCRAMBLE",
  },
  {
    href: "/match?mode=quick&game=draw",
    emoji: "✏️",
    title: "خمن المثل",
    desc: "خمن المثل من الإيموجي",
    tag: "EMOJI",
  },
  {
    href: "/match?mode=quick&game=categories",
    emoji: "🌍",
    title: "إنسان حيوان نبات جماد بلاد",
    desc: "فكر بسرعة وجاوب",
    tag: "CATEGORIES",
  },
  {
    href: "/match?mode=quick&game=quiz",
    emoji: "❓",
    title: "الأسئلة",
    desc: "اختر فئة وجاوب 5 أسئلة",
    tag: "QUIZ",
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
            backgroundSize:
              "18px 18px, 18px 18px, 20px 20px, 20px 20px, 16px 16px, 16px 16px",
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
            منصة ألعاب سعودية تفاعلية تصلح للجلسة العائلية.
          </p>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white/95">اختر الوضع</h2>
            <span className="text-sm tracking-widest text-cyan-300">
              PLAY MODE
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/match?mode=session">
              <div className="group h-full min-h-[230px] rounded-[28px] border border-pink-400/40 bg-[#120020]/90 p-6 shadow-[0_0_40px_rgba(255,0,150,0.18)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_0_34px_rgba(255,0,150,0.32)]">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-right">
                      <p className="text-sm tracking-widest text-yellow-300">
                        SESSION MODE
                      </p>
                      <h3 className="mt-3 text-3xl font-black text-white">
                        🏆 تحدي الجلسة
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-7 text-white/75">
                        عدة ألعاب متسلسلة داخل جلسة واحدة، وكل لعبة تعطي نقطة،
                        وفي النهاية يظهر الفائز العام.
                      </p>
                    </div>

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-3xl shadow-[0_0_12px_rgba(255,255,255,0.08)]">
                      🏁
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="rounded-2xl border border-yellow-300/15 bg-yellow-300/10 px-4 py-3 text-sm text-white/85">
                      5 ألعاب متتالية: الأسئلة، خمن الكلمة، حروف بالخلاط، لف وخمن، إنسان حيوان نبات جماد بلاد
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="h-full min-h-[230px] rounded-[28px] border border-cyan-300/30 bg-[#120825]/80 p-6 shadow-[0_0_34px_rgba(34,211,238,0.12)]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-right">
                    <p className="text-sm tracking-widest text-cyan-300">
                      QUICK MODE
                    </p>
                    <h3 className="mt-3 text-3xl font-black text-white">
                      ⚡ تحدي سريع
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-white/75">
                      اختر لعبة واحدة فقط وادخل مباشرة بدون نظام جلسة كامل.
                    </p>
                  </div>

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-3xl shadow-[0_0_12px_rgba(255,255,255,0.08)]">
                    🎮
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 py-3 text-sm text-white/85">
                  مناسب لو تبي تجربة سريعة للعبة واحدة فقط.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white/95">ألعاب التحدي السريع</h2>
            <span className="text-sm tracking-widest text-cyan-300">
              SELECT GAME
            </span>
          </div>

          <div className="rounded-[28px] border border-pink-400/40 bg-[#120020]/90 p-6 shadow-[0_0_50px_rgba(255,0,150,0.20)]">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quickGames.map((game) => (
                <Link key={game.title} href={game.href}>
                  <div className="group h-full rounded-2xl border border-pink-400/30 bg-[#1a0030] p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(255,0,150,0.28)]">
                    <div className="flex h-full items-center justify-between gap-4">
                      <div className="text-right">
                        <h4 className="text-lg font-black text-white">
                          {game.title}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-white/65">
                          {game.desc}
                        </p>
                        <span className="mt-3 block text-xs tracking-widest text-yellow-300">
                          {game.tag}
                        </span>
                      </div>

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-2xl shadow-[0_0_12px_rgba(255,255,255,0.08)]">
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
