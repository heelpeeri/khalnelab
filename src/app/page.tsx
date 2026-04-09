import Link from "next/link";
import { Logo } from "@/components/Logo";

const games = [
  {
    href: "/match?game=wheel",
    title: "لف وخمن",
    desc: "لف العجلة وجرب حظك",
    tag: "WHEEL",
    emoji: "🎡",
  },
  {
    href: "/match?game=word",
    title: "خمن الكلمة",
    desc: "خمن الكلمة بحروف عربية",
    tag: "WORD",
    emoji: "💬",
  },
  {
    href: "/match?game=scramble",
    title: "حروف بالخلاط",
    desc: "رتب الحروف قبل الوقت يخلص",
    tag: "SCRAMBLE",
    emoji: "🧩",
  },
  {
    href: "/match?game=draw",
    title: "خمن المثل",
    desc: "خمن المثل من الإيموجي",
    tag: "EMOJI",
    emoji: "✏️",
  },
  {
    href: "/match?game=categories",
    title: "إنسان حيوان نبات جماد بلاد",
    desc: "الكل يفكر بسرعة ويجاوب",
    tag: "CATEGORIES",
    emoji: "🌍",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-10 text-white relative overflow-hidden">

      {/* خلفية نقط الأركيد */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="h-full w-full bg-[radial-gradient(circle,_rgba(255,255,255,0.2)_1px,_transparent_1px)] [background-size:30px_30px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* لوجو */}
        <div className="flex justify-center">
          <Logo size={180} />
        </div>

        {/* العنوان */}
        <section className="mt-6 text-center">
          <h1 className="text-5xl font-black text-[#98ffb6] drop-shadow-[0_0_20px_rgba(152,255,182,0.35)] md:text-6xl">
            خل نلعب
          </h1>

          <p className="mt-3 text-white/80 text-lg md:text-xl">
            ألعاب جلسات سريعة، تنافس، وضحك داخل البيت.
          </p>

          <Link
            href="/match?game=word"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-3 font-black shadow-[0_0_20px_rgba(255,120,0,0.4)] active:scale-95"
          >
            ابدأ اللعب
          </Link>
        </section>

        {/* لوحة الألعاب */}
        <section className="mt-12">

          <div className="rounded-[28px] border border-pink-400/40 bg-[#140021]/80 p-6 shadow-[0_0_40px_rgba(255,0,150,0.25)]">

            {/* عنوان */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white/80">
                اختر اللعبة
              </h2>

              <span className="text-sm font-black tracking-widest text-cyan-300">
                SELECT MODE
              </span>
            </div>

            {/* grid الألعاب */}
            <div className="grid gap-4 md:grid-cols-2">

              {games.map((game) => (
                <Link key={game.title} href={game.href}>
                  <div className="group relative rounded-2xl border border-pink-400/30 bg-[#1b0030] p-5 transition hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,0,150,0.25)]">

                    {/* glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition" />

                    <div className="relative z-10 flex items-center justify-between gap-4">

                      <div className="text-right">
                        <h3 className="text-xl font-black">
                          {game.title}
                        </h3>

                        <p className="mt-1 text-sm text-white/70">
                          {game.desc}
                        </p>

                        <span className="mt-2 inline-block text-xs tracking-widest text-yellow-300">
                          {game.tag}
                        </span>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-2xl">
                        {game.emoji}
                      </div>

                    </div>
                  </div>
                </Link>
              ))}

            </div>
          </div>
        </section>

        {/* footer arcade */}
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
