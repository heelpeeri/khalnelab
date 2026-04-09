import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

const turnBasedGames = [
  {
    href: "/match?game=word",
    emoji: "💬",
    title: "خمن الكلمة",
    desc: "خمن الكلمة بحروف عربية",
  },
  {
    href: "/match?game=categories",
    emoji: "🌍",
    title: "إنسان حيوان نبات جماد بلاد",
    desc: "المعروف لا يعرف",
  },
  {
    href: "/match?game=wheel",
    emoji: "🎡",
    title: "لف وخمن",
    desc: "لف العجلة وجرب حظك 😏",
  },
];

const speedGames = [
  {
    href: "/match?game=draw",
    emoji: "✏️",
    title: "خمن المثل",
    desc: "خمن المثل من الإيموجي",
  },
  {
    href: "/match?game=scramble",
    emoji: "🧩",
    title: "حروف بالخلاط",
    desc: "حروف ملخبطة؟ رتبها!",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-center">
          <Logo size={210} />
        </div>

        <section className="mx-auto mt-6 max-w-3xl text-center">
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/80 md:text-2xl">
            منصة ألعاب عائلية سعودية بتجربة سريعة، واضحة، وممتعة داخل البيت.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/match?game=word" className="btn-primary active:scale-95">
              ابدأ التحدي
            </Link>
          </div>
        </section>

        <section className="mt-14 grid gap-8 xl:grid-cols-2">
          <GlassCard className="rounded-[32px] p-7 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-white/60">نمط اللعب</p>
                <h2 className="mt-1 text-3xl font-black md:text-4xl">
                  دور دور
                </h2>
                <p className="mt-2 text-sm leading-7 text-white/70 md:text-base">
                  الوضع هدااووه.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-3xl">
                🎯
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {turnBasedGames.map((game) => (
                <Link key={game.title} href={game.href} className="block">
                  <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 text-right transition duration-200 hover:-translate-y-1 hover:bg-white/14">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-3xl">
                        {game.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-2xl font-black">{game.title}</h3>
                        <p className="mt-2 text-sm text-white/75 md:text-base">
                          {game.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="rounded-[32px] border border-white/15 bg-black/20 p-7 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-white/60">نمط اللعب</p>
                <h2 className="mt-1 text-3xl font-black md:text-4xl">
                  أسرع واحد يفوز
                </h2>
                <p className="mt-2 text-sm leading-7 text-white/70 md:text-base">
                  ردات الفعل السريعة تفوزك بس لا تنكب عمرك.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-3xl">
                ⚡
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {speedGames.map((game) => (
                <Link key={game.title} href={game.href} className="block">
                  <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 text-right transition duration-200 hover:-translate-y-1 hover:bg-white/14">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-3xl">
                        {game.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-2xl font-black">{game.title}</h3>
                        <p className="mt-2 text-sm text-white/75 md:text-base">
                          {game.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </section>
      </div>
    </main>
  );
}
