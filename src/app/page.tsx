import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

const games = [
  {
    href: "/match?game=quiz",
    emoji: "❓",
    title: "الأسئلة",
    desc: "فئات وأسئلة سريعة للجلسة",
    help: "اختر الفئة وابدأ بجولة أسئلة متنوعة بين اختيار من متعدد وصح أو خطأ وأسئلة مباشرة.",
  },
  {
    href: "/match?game=wheel",
    emoji: "🎡",
    title: "لف وخمن",
    desc: "لف العجلة وجرب حظك 😏",
    help: "لف العجلة وانتظر النتيجة، وبعدها يبدأ التحدي حسب اللي يطلع لكم.",
  },
  {
    href: "/match?game=word",
    emoji: "💬",
    title: "خمن الكلمة",
    desc: "خمن الكلمة بحروف عربية",
    help: "خمن الكلمة الصحيحة خلال عدد محدود من المحاولات قبل لا ينتهي الدور.",
  },
  {
    href: "/match?game=categories",
    emoji: "🌍",
    title: "إنسان حيوان نبات جماد بلاد",
    desc: "فكر بسرعة وجاوب",
    help: "يعرض لك حرف، وكل فريق يجيب إجابات على نفس الحرف قبل نهاية الوقت.",
  },
  {
    href: "/match?game=draw",
    emoji: "✏️",
    title: "خمن المثل",
    desc: "خمن المثل من الإيموجي",
    help: "يظهر مثل شعبي على شكل إيموجي، والمطلوب تخمينه قبل الفريق الثاني.",
  },
  {
    href: "/match?game=scramble",
    emoji: "🧩",
    title: "حروف بالخلاط",
    desc: "حروف ملخبطة؟ رتبها!",
    help: "رتب الحروف بسرعة وطلع الكلمة الصحيحة قبل غيرك.",
  },
];

function InfoBadge({ text }: { text: string }) {
  return (
    <div className="group relative">
      <div className="flex h-8 w-8 cursor-help items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-black text-white/85 transition hover:bg-white/15">
        !
      </div>

      <div className="pointer-events-none absolute left-0 top-10 z-20 hidden w-72 rounded-2xl border border-white/15 bg-[#16001f]/95 p-4 text-right text-sm leading-7 text-white/80 shadow-2xl group-hover:block">
        {text}
      </div>
    </div>
  );
}

function GameCard({
  href,
  emoji,
  title,
  desc,
  help,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
  help: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="rounded-[26px] border border-white/12 bg-white/7 p-5 text-right transition duration-200 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-fuchsia-400/10 to-yellow-300/20 text-3xl">
            {emoji}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-white">{title}</h3>
              <InfoBadge text={help} />
            </div>

            <p className="mt-2 text-sm leading-7 text-white/70">{desc}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3b003f_0%,#14001d_45%,#09000f_100%)] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center">
            <Logo size={150} />
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/78 md:text-2xl md:leading-[2.2rem]">
            منصة ألعاب عائلية سعودية بتجربة سريعة، واضحة، وممتعة داخل البيت.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/match?mode=session"
              className="rounded-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-500 px-7 py-3 font-black text-white shadow-[0_0_25px_rgba(255,60,150,0.35)] transition hover:scale-[1.02] active:scale-95"
            >
              ابدأ تحدي الجلسة
            </Link>

            <Link
              href="/match?game=quiz"
              className="rounded-2xl border border-white/15 bg-white/8 px-7 py-3 font-bold text-white transition hover:bg-white/12 active:scale-95"
            >
              جرّب لعبة سريعة
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <GlassCard className="rounded-[34px] border border-fuchsia-400/20 bg-black/20 p-7 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="text-right">
                <div className="flex items-center justify-end gap-3">
                  <InfoBadge text="تحدي الجلسة يجمع أكثر من لعبة داخل نفس الجلسة، وكل لعبة تعتبر جولة مستقلة، وفي النهاية ينحسب الفائز بالنقاط." />
                  <div>
                    <p className="text-sm font-bold text-white/55">الوضع الرئيسي</p>
                    <h2 className="mt-1 text-3xl font-black md:text-5xl">
                      تحدي الجلسة 🏆
                    </h2>
                  </div>
                </div>

                <p className="mt-4 max-w-3xl text-sm leading-8 text-white/72 md:text-base">
                  اختر الألعاب اللي تبيها، وكل لعبة تكون جولة مستقلة، وفي النهاية
                  يبان الفائز بالنقاط.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-3xl shadow-[0_0_20px_rgba(120,0,255,0.25)]">
                🏁
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/match?mode=session"
                className="inline-flex rounded-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-500 px-7 py-3 font-black text-white shadow-[0_0_25px_rgba(255,60,150,0.35)] transition hover:scale-[1.02] active:scale-95"
              >
                ابدأ تحدي الجلسة
              </Link>
            </div>
          </GlassCard>
        </section>

        <section className="mt-12">
          <div className="mb-5 text-right">
            <p className="text-sm font-bold text-white/55">الألعاب</p>
            <h2 className="mt-1 text-2xl font-black md:text-4xl">
              اختر اللعبة المناسبة للجلسة
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {games.map((game) => (
              <GameCard
                key={game.title}
                href={game.href}
                emoji={game.emoji}
                title={game.title}
                desc={game.desc}
                help={game.help}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
