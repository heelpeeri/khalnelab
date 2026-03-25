import { notFound } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

function WordGame() {
  const rows = Array.from({ length: 6 });
  return (
    <GlassCard className="p-6">
      <h2 className="text-2xl font-black">وشي الكلمة؟</h2>
      <p className="mt-2 text-white/80">نسخة MVP: واجهة أولية للكلمة الجماعية.</p>
      <div className="mt-6 grid gap-2">
        {rows.map((_, i) => (
          <div key={i} className="flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-12 w-12 rounded-2xl border border-white/25 bg-white/10" />
            ))}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function DrawGame() {
  return (
    <GlassCard className="p-6">
      <h2 className="text-2xl font-black">وشي الرسمة؟</h2>
      <p className="mt-2 text-white/80">نسخة MVP: مساحة رسم أولية وأدوار لاحقًا.</p>
      <div className="mt-6 h-80 rounded-[28px] border border-white/20 bg-white/10" />
    </GlassCard>
  );
}

function CategoriesGame() {
  const fields = ["إنسان", "حيوان", "نبات", "جماد", "بلاد"];
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black">إنسان حيوان نبات جماد بلاد</h2>
        <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-red-500">الحرف: م</div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <label key={field} className="rounded-3xl border border-white/20 bg-white/10 p-4">
            <div className="mb-3 text-sm font-black text-white/90">{field}</div>
            <input className="input" placeholder={`اكتب ${field}`} />
          </label>
        ))}
      </div>
    </GlassCard>
  );
}

export default async function GamePage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string; name?: string }>;
}) {
  const params = await searchParams;
  const game = params.game ?? "word";
  const name = params.name ?? "لاعب";

  const board =
    game === "word" ? <WordGame /> : game === "draw" ? <DrawGame /> : game === "categories" ? <CategoriesGame /> : null;

  if (!board) return notFound();

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto mb-6 flex max-w-6xl items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/70">اللاعب الحالي</p>
          <p className="text-xl font-black">{name}</p>
        </div>
        <Logo size={80} />
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
        {board}

        <GlassCard className="p-6">
          <h3 className="text-xl font-black">السكور بورد</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <span>1. {name}</span>
                <span className="font-black">0</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
            <p className="text-sm text-white/70">المؤقت</p>
            <p className="mt-2 text-4xl font-black">60</p>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}