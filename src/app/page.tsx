import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

const games = [
  {
    href: "/nickname?game=word",
    emoji: "💬",
    title: "وشي الكلمة؟",
    desc: "خمن الكلمة قبل الكل"
  },
  {
    href: "/nickname?game=draw",
    emoji: "✏️",
    title: "وش المثل؟",
    desc: "خمن المثل من الإيموجي"
  },
  {
    href: "/nickname?game=categories",
    emoji: "🌍",
    title: "إنسان حيوان نبات جماد",
    desc: "ومعها بلاد أيضًا"
  }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10 text-center">
      
      {/* 🔥 الشعار صار أكبر ومركزي */}
      <div className="mb-6 flex justify-center">
        <Logo size={220} />
      </div>

      {/* ❌ حذفنا خل نلعب */}

      <p className="mt-2 max-w-xl text-lg text-white/85">
        منصة ألعاب عائلية عربية بتصميم موحد، وغرف سهلة، وتجربة مرحة على الجوال.
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
        <Link href="/nickname?game=word" className="btn-primary">جرب الآن</Link>
        <Link href="/nickname?game=categories" className="btn-secondary">ابدأ اللعب</Link>
      </div>
    </main>
  );
}
