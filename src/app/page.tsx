import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

const turnBasedGames = [
  {
    href: "/match?game=word",
    emoji: "💬",
    title: "خمن الكلمة",
  },
  {
    href: "/match?game=categories",
    emoji: "🌍",
    title: "إنسان حيوان نبات جماد بلاد",
  },
];

const speedGames = [
  {
    href: "/match?game=draw",
    emoji: "✏️",
    title: "خمن المثل",
  },
  {
    href: "/match?game=scramble",
    emoji: "🧩",
    title: "حروف بالخلاط",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-10 text-center text-white">
      <div className="mb-6 flex justify-center">
        <Logo size={220} />
      </div>

      <p className="mx-auto max-w-2xl text-3xl font-bold leading-relaxed">
        منصة ألعاب عائلية ممتعة داخل البيت
      </p>

      {/* عمودين */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">

        {/* دور دور */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-black mb-6">🎯 دور دور</h2>

          <div className="space-y-4">
            {turnBasedGames.map((game) => (
              <Link key={game.title} href={game.href}>
                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 hover:bg-white/20 transition">
                  <span className="text-3xl">{game.emoji}</span>
                  <span className="text-xl font-bold">{game.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>

        {/* السرعة */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-black mb-6">⚡ أسرع واحد</h2>

          <div className="space-y-4">
            {speedGames.map((game) => (
              <Link key={game.title} href={game.href}>
                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 hover:bg-white/20 transition">
                  <span className="text-3xl">{game.emoji}</span>
                  <span className="text-xl font-bold">{game.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>

      </div>
    </main>
  );
}
