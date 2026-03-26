import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

const games = [
  {
    href: "/match?game=word",
    emoji: "💬",
    title: "وشي الكلمة؟",
    desc: "خمن الكلمة بحروف عربية"
  },
  {
    href: "/match?game=draw",
    emoji: "✏️",
    title: "وش المثل؟",
    desc: "خمن المثل من الإيموجي"
  },
  {
    href: "/match?game=categories",
    emoji: "🌍",
    title: "إنسان حيوان نبات جماد",
    desc: "ومعها بلاد أيضًا"
  }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-6 flex justify-center">
        <Logo size={220} />
      </div>

      <p className="mt-2 max-w-xl text-lg text-white/85">
        منصة ألعاب عائلية عربية بتصميم موحد، وتجربة جماعية ممتعة داخل البيت.
      </p>

      <div className="mt-10 grid w-full max-w-6xl gap-5 md:grid-cols-3">
        {games.map((game) => (
          <Link key={game.title} href={game.href} className="block">
            <GlassCard className="h-full cursor-pointer p-6 transition hover:-translate-y-1">
              <div className="text-4xl">{game.emoji}</div>
              <h2 className="mt-4 text-2xl font-black">{game.title}</h2>
              <p className="mt-2 text-sm text-white/75">{game.desc}</p>
            </GlassCard>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/match?game=word" className="btn-primary">
          ابدأ التحدي
        </Link>
      </div>
    </main>
  );
}
