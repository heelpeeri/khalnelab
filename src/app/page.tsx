import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

const featuredGames = [
  {
    href: "/match?game=quiz",
    emoji: "❓",
    title: "الأسئلة",
    desc: "فئات وأسئلة سريعة للجلسة",
  },
  {
    href: "/match?game=wheel",
    emoji: "🎡",
    title: "لف وخمن",
    desc: "لف العجلة وجرب حظك 😏",
  },
];

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
    desc: "فكر بسرعة وجاوب",
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
  {
    href: "/match?game=quiz",
    emoji: "❓",
    title: "الأسئلة",
    desc: "اختر فئة وجاوب بسرعة",
  },
];

function GameCard({
  href,
  emoji,
  title,
  desc,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="rounded-[24px] border border-white/15 bg-white/8 p-4 text-right transition duration-200 hover:-translate-y-1 hover:bg-white/14">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-2xl">
            {emoji}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black">{title}</h3>
            <p className="mt-1 text-sm text-white/70">{desc}</p>
          </div>
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
          <Logo size={145} />
        </div>

        <section className="mx-auto mt-4 max-w-3xl text-center">
          <h1 className="text-3xl font-black md:text-5xl">خل نلعب 🎮</h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/75 md:text-xl">
            منصة ألعاب عائلية سعودية بتجربة سريعة، واضحة، وممتعة داخل البيت.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/match?mode=session"
              className="btn-primary active:scale-95"
            >
              ابدأ تحدي الجلسة
            </Link>

            <Link
              href="/match?game=quiz"
              className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/15 active:scale-95"
            >
              جرّب لعبة سريعة
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <GlassCard className="rounded-[32px] p-7 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-white/60">الوضع الرئيسي</p>
                <h2 className="mt-1 text-3xl font-black md:text-4xl">
                  تحدي الجلسة 🏆
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
                  اختر الألعاب اللي تبيها، وكل لعبة تكون جولة مستقلة، وفي النهاية
                  يبان الفائز بالنقاط.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-3xl">
                🏁
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-yellow-300/15 bg-yellow-300/10 p-4 text-right">
              <p className="text-sm font-bold text-white/70">مناسب للجلسات</p>
              <p className="mt-1 text-sm leading-7 text-white/85">
                ألعاب متسلسلة + فرق + نقاط + فائز نهائي
              </p>
            </div>

            <div className="mt-6">
              <Link href="/match?mode=session" className="btn-primary">
                ابدأ تحدي الجلسة
              </Link>
            </div>
          </GlassCard>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-white/60">اقتراحات البداية</p>
              <h2 className="mt-1 text-2xl font-black md:text-3xl">
                الأكثر لعبًا 🔥
              </h2>
            </div>

            <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold text-white/70">
              جرّبها أول
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featuredGames.map((game) => (
              <Link key={game.title} href={game.href} className="block">
                <div className="rounded-[28px] border border-pink-300/20 bg-pink-500/10 p-5 text-right transition duration-200 hover:-translate-y-1 hover:bg-pink-500/15">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-3xl">
                      {game.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-black">{game.title}</h3>
                      <p className="mt-1 text-sm text-white/75 md:text-base">
                        {game.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 xl:grid-cols-2">
          <GlassCard className="rounded-[32px] p-7 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-white/60">نمط اللعب</p>
                <h2 className="mt-1 text-3xl font-black md:text-4xl">
                  دور دور
                </h2>
                <p className="mt-2 text-sm leading-7 text-white/70 md:text-base">
                  ألعاب أهدأ وتعتمد على التفكير وأخذ الدور.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-3xl">
                🎯
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {turnBasedGames.map((game) => (
                <GameCard
                  key={game.title}
                  href={game.href}
                  emoji={game.emoji}
                  title={game.title}
                  desc={game.desc}
                />
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
                  ألعاب سريعة تعتمد على الانتباه وردة الفعل.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-3xl">
                ⚡
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {speedGames.map((game) => (
                <GameCard
                  key={game.title}
                  href={game.href}
                  emoji={game.emoji}
                  title={game.title}
                  desc={game.desc}
                />
              ))}
            </div>
          </GlassCard>
        </section>
      </div>
    </main>
  );
}
