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

function StarField() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,153,0.18),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(0,153,255,0.14),_transparent_30%),linear-gradient(180deg,_#140022_0%,_#250026_35%,_#4a001b_100%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_30%,white_1px,transparent_1.5px),radial-gradient(circle_at_70%_20%,#7dd3fc_1px,transparent_1.5px),radial-gradient(circle_at_80%_75%,#f9a8d4_1px,transparent_1.5px),radial-gradient(circle_at_35%_80%,#fde047_1px,transparent_1.5px)] [background-size:240px_240px]" />

      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
    </>
  );
}

function SectionCard({
  title,
  subtitle,
  icon,
  games,
}: {
  title: string;
  subtitle: string;
  icon: string;
  games: { href: string; emoji: string; title: string; desc: string }[];
}) {
  return (
    <GlassCard className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/10 p-7 shadow-[0_0_30px_rgba(255,0,128,0.12)] backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_35%)]" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-white/55">نمط اللعب</p>
          <h2 className="mt-1 text-3xl font-black text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-white/75 md:text-base">
            {subtitle}
          </p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-3xl shadow-[0_0_20px_rgba(255,255,255,0.08)]">
          {icon}
        </div>
      </div>

      <div className="relative z-10 mt-8 grid gap-5 md:grid-cols-2">
        {games.map((game) => (
          <Link key={game.title} href={game.href} className="block">
            <div className="group relative h-full rounded-[28px] border border-white/15 bg-black/15 p-6 text-right transition duration-200 hover:-translate-y-1 hover:border-pink-300/30 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(255,0,153,0.18)]">
              <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_45%)] opacity-0 transition group-hover:opacity-100" />

              <div className="relative z-10 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-3xl shadow-[0_0_14px_rgba(255,255,255,0.08)]">
                  {game.emoji}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-2xl font-black text-white">{game.title}</h3>
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
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 text-white">
      <StarField />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex justify-center">
          <div className="drop-shadow-[0_0_22px_rgba(255,120,220,0.35)]">
            <Logo size={210} />
          </div>
        </div>

        <section className="mx-auto mt-6 max-w-3xl text-center">
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/85 md:text-2xl">
            منصة ألعاب عائلية سعودية بتجربة سريعة، واضحة، وممتعة داخل البيت.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/match?game=word"
              className="rounded-full border border-pink-300/40 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 px-8 py-4 text-lg font-black text-white shadow-[0_0_28px_rgba(255,0,153,0.32)] transition active:scale-95 hover:brightness-110"
            >
              ابدأ التحدي
            </Link>
          </div>
        </section>

        <section className="mt-14 grid gap-8 xl:grid-cols-2">
          <SectionCard
            title="دور دور"
            subtitle="هذا النمط أهدى شوي، تفكير وتركيز ووقت مضبوط."
            icon="🎯"
            games={turnBasedGames}
          />

          <SectionCard
            title="أسرع واحد يفوز"
            subtitle="هنا السرعة تحكم، لا تتردد كثير وتورط نفسك."
            icon="⚡"
            games={speedGames}
          />
        </section>
      </div>
    </main>
  );
}
