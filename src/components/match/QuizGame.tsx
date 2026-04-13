'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import QuizCategorySelect from "@/components/match/QuizCategorySelect";
import { quizQuestions, QuizCategoryKey, QuizQuestion } from "@/lib/quizQuestions";

type WinnerType = "side1" | "side2" | "none";

export default function QuizGame({
  onRoundEnd,
  roundKey,
}: {
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
}) {
  const [category, setCategory] = useState<QuizCategoryKey | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  function pickQuestions(cat: QuizCategoryKey) {
    const all = quizQuestions[cat];
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }

  useEffect(() => {
    setCategory(null);
    setQuestions([]);
    setIndex(0);
    setShowAnswer(false);
  }, [roundKey]);

  function handleSelectCategory(cat: QuizCategoryKey) {
    setCategory(cat);
    setQuestions(pickQuestions(cat));
    setIndex(0);
    setShowAnswer(false);
  }

  function nextQuestion() {
    if (index >= questions.length - 1) {
      onRoundEnd();
      return;
    }

    setIndex((prev) => prev + 1);
    setShowAnswer(false);
  }

  if (!category) {
    return <QuizCategorySelect onSelect={handleSelectCategory} />;
  }

  const current = questions[index];

  return (
    <GlassCard className="min-h-[700px] p-8 text-center">
      <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
        QUIZ
      </p>

      <h2 className="mt-2 text-3xl font-black">الأسئلة</h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-sm text-white/60">الفئة</p>
          <p className="mt-1 text-xl font-black text-yellow-200">
            {category === "seerah"
              ? "السيرة والأنبياء"
              : category === "saudi"
              ? "تاريخ السعودية"
              : "كرة القدم السعودية"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-sm text-white/60">السؤال</p>
          <p className="mt-1 text-xl font-black text-cyan-200">
            {index + 1} / {questions.length}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_0_18px_rgba(255,255,255,0.04)]">
        <p className="text-2xl font-black leading-relaxed text-white">
          {current.question}
        </p>
      </div>

      {!showAnswer ? (
        <div className="mt-8">
          <button
            onClick={() => setShowAnswer(true)}
            className="btn-primary min-w-[180px]"
          >
            إظهار الإجابة
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <div className="rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
            <p className="text-sm text-white/70">الإجابة الصحيحة</p>
            <p className="mt-2 text-2xl font-black text-yellow-100">
              {current.answer}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={nextQuestion}
              className="btn-primary min-w-[180px]"
            >
              {index >= questions.length - 1 ? "إنهاء الجولة" : "السؤال التالي"}
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
