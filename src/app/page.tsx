import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

const turnBasedGames = [
  {
    href: "/match?game=word",
    emoji: "💬",
    title: "خمن الكلمة",
    desc: "خمن الكلمة بحروف عربية"
  },
  {
    href: "/match?game=categories",
    emoji: "🌍",
    title: "إنسان حيوان نبات جماد بلاد",
    desc: "المعروف لا يعرف"
  },
];

const speedGames = [
  {
    href: "/match?game=draw",
    emoji: "✏️",
    title: "خمن المثل",
    desc: "خمن المتل من الإيموجي"
  },
  {
    href: "/match?game=scramble",
    emoji: "🧩",
    title: "حروف بالخلاط",
    desc: "حروف ملخبطة؟ رتبها!"
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-6 flex justify-center">
        <Logo size={220} />
      </div>

      <p className="mt-2 max-w-2xl text-2xl font-bold leading-relaxed text-white/90 md:text-3xl">
        منصة ألعاب عائلية سعودية وتجربة جماعية ممتعة داخل البيت.
      </p>

      <div className="mt-12 w-full max-w-6xl space-y-10">
        <section>
          <h2 className="mb-4 text-2xl font-black text-white">ألعاب دور دور</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {turnBasedGames.map((game) => (
              <Link key={game.title} href={game.href} className="block">
                <GlassCard className="h-full cursor-pointer p-6 transition hover:-translate-y-1">
                  <div className="text-4xl">{game.emoji}</div>
                  <h3 className="mt-4 text-2xl font-black">{game.title}</h3>
                  <p className="mt-2 text-sm text-white/75">{game.desc}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-black text-white">اسرع واحد يفوز</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {speedGames.map((game) => (
              <Link key={game.title} href={game.href} className="block">
                <GlassCard className="h-full cursor-pointer p-6 transition hover:-translate-y-1">
                  <div className="text-4xl">{game.emoji}</div>
                  <h3 className="mt-4 text-2xl font-black">{game.title}</h3>
                  <p className="mt-2 text-sm text-white/75">{game.desc}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/match?game=word" className="btn-primary">
          ابدأ التحدي
        </Link>
      </div>
    </main>
  );
}
