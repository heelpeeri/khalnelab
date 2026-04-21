"use client";

import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

const quickGamesPreview = [
  { emoji: "❓", title: "الأسئلة" },
  { emoji: "🎡", title: "لف وخمن" },
  { emoji: "💬", title: "خمن الكلمة" },
  { emoji: "🌍", title: "إنسان حيوان نبات جماد بلاد" },
  { emoji: "✏️", title: "خمن المثل" },
  { emoji: "🧩", title: "حروف بالخلاط" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3b003f_0%,#14001d_45%,#09000f_100%)] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <section className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center">
            <Logo size={150} />
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/78 md:text-2xl md:leading-[2.2rem]">
            منصة ألعاب عائلية سعودية بتجربة سريعة، واضحة، وممتعة داخل البيت.
          </p>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <GlassCard className="rounded-[34px] border border-fuchsia-400/20 bg-black/20 p-7 md:p-8">
            <div className="text-right">
              <p className="text-sm font-bold text-white/55">الوضع الرئيسي</p>
              <h2 className="mt-2 text-3xl font-black md:text-5xl">
                تحدي الجلسة 🏆
              </h2>

              <p className="mt-4 text-sm leading-8 text-white/72 md:text-base">
                سجّل أسماء الفرق مرة واحدة، اختر الألعاب اللي تبيها، وكل لعبة
                تكون جولة مستقلة، وفي النهاية يبان الفائز بالنقاط.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/match?mode=session"
                  className="rounded-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-500 px-7 py-3 font-black text-white shadow-[0_0_25px_rgba(255,60,150,0.35)] transition hover:scale-[1.02] active:scale-95"
                >
                  ابدأ تحدي الجلسة
                </Link>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="rounded-[34px] border border-cyan-300/20 bg-black/20 p-7 md:p-8">
            <div className="text-right">
              <p className="text-sm font-bold text-white/55">الوضع السريع</p>
              <h2 className="mt-2 text-3xl font-black md:text-5xl">
                لعبة سريعة ⚡
              </h2>

              <p className="mt-4 text-sm leading-8 text-white/72 md:text-base">
                اختر لعبة واحدة فقط، حدّد عدد الجولات، وابدأ مباشرة بدون تعقيد.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {quickGamesPreview.map((game) => (
                  <div
                    key={game.title}
                    className="rounded-2xl border border-white/12 bg-white/7 px-4 py-2 text-sm text-white/80"
                  >
                    <span className="ml-2">{game.emoji}</span>
                    {game.title}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/match?mode=quick"
                  className="rounded-2xl border border-white/15 bg-white/8 px-7 py-3 font-bold text-white transition hover:bg-white/12 active:scale-95"
                >
                  اختر لعبة سريعة
                </Link>
              </div>
            </div>
          </GlassCard>
        </section>
      </div>
    </main>
  );
}
