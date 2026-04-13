'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { quizQuestions, QuizCategoryKey } from "@/lib/quizQuestions";

type WinnerType = "side1" | "side2" | "none";

export default function QuizGame({
  onRoundEnd,
  roundKey,
}: {
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
}) {
  const [category, setCategory] = useState<QuizCategoryKey | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // اختيار 5 أسئلة عشوائية
  function pickQuestions(cat: QuizCategoryKey) {
    const all = quizQuestions[cat];
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }

  // إعادة تعيين كل جولة
  useEffect(() => {
    setCategory(null);
    setQuestions([]);
    setIndex(0);
    setShowAnswer(false);
  }, [roundKey]);

  function startCategory(cat: QuizCategoryKey) {
    setCategory(cat);
    setQuestions(pickQuestions(cat));
    setIndex(0);
    setShowAnswer(false);
  }

  function nextQuestion() {
    if (index >= questions.length - 1) {
      onRoundEnd(); // نهاية الجولة
      return;
    }

    setIndex((i) => i + 1);
    setShowAnswer(false);
  }

  // 📌 شاشة اختيار الفئة
  if (!category) {
    return (
      <GlassCard className="min-h-[700px] p-8 text-center">
        <h2 className="text-3xl font-black">اختر الفئة</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <button
            onClick={() => startCategory("seerah")}
            className="btn-primary"
          >
            السيرة والأنبياء
          </button>

          <button
            onClick={() => startCategory("saudi")}
            className="btn-primary"
          >
            تاريخ السعودية
          </button>

          <button
            onClick={() => startCategory("football")}
            className="btn-primary"
          >
            كرة القدم السعودية
          </button>
        </div>
      </GlassCard>
    );
  }

  const current = questions[index];

  return (
    <GlassCard className="min-h-[700px] p-8 text-center">
      <p className="text-sm text-white/60">
        سؤال {index + 1} / {questions.length}
      </p>

      <h2 className="mt-6 text-3xl font-black leading-relaxed">
        {current.question}
      </h2>

      {/* زر إظهار الإجابة */}
      {!showAnswer && (
        <button
          onClick={() => setShowAnswer(true)}
          className="btn-primary mt-8"
        >
          إظهار الإجابة
        </button>
      )}

      {/* الإجابة */}
      {showAnswer && (
        <div className="mt-8">
          <p className="text-xl text-yellow-200 font-black">
            {current.answer}
          </p>

          <button
            onClick={nextQuestion}
            className="btn-primary mt-6"
          >
            السؤال التالي
          </button>
        </div>
      )}
    </GlassCard>
  );
}
