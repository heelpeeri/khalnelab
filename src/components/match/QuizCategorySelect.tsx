'use client';

import { GlassCard } from "@/components/GlassCard";

type QuizCategoryKey = "seerah" | "saudi" | "football" | "geography";

export default function QuizCategorySelect({
  onSelect,
}: {
  onSelect: (category: QuizCategoryKey) => void;
}) {
  const categories = [
    {
      key: "seerah",
      title: "السيرة والأنبياء",
      emoji: "🕌",
      desc: "أسئلة عن الأنبياء والسيرة",
    },
    {
      key: "saudi",
      title: "تاريخ السعودية",
      emoji: "🇸🇦",
      desc: "أسئلة عن تاريخ المملكة",
    },
    {
      key: "football",
      title: "كرة القدم السعودية",
      emoji: "⚽",
      desc: "أسئلة عن الكرة السعودية",
    },
    {
      key: "geography",
      title: "الجغرافيا",
      emoji: "🌍",
      desc: "أسئلة عن الدول والعواصم والمعالم",
    },
  ];

  return (
    <GlassCard className="min-h-[700px] p-8 text-center">
      <h2 className="text-3xl font-black">اختر الفئة</h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onSelect(cat.key as QuizCategoryKey)}
            className="group relative rounded-2xl border border-white/15 bg-white/10 p-6 text-right transition hover:-translate-y-1 hover:bg-white/20 active:scale-[0.98]"
          >
            <div className="text-3xl">{cat.emoji}</div>

            <h3 className="mt-3 text-xl font-black text-white">
              {cat.title}
            </h3>

            <p className="mt-1 text-sm text-white/70">
              {cat.desc}
            </p>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
