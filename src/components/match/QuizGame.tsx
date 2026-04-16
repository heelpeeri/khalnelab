'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import QuizCategorySelect from "@/components/match/QuizCategorySelect";
import {
  quizQuestions,
  QuizCategoryKey,
  QuizQuestion,
} from "@/lib/quizQuestions";

type PlayMode = "solo" | "teams";
type WinnerType = "side1" | "side2" | "none";

const LAST_ROUND_QUESTIONS: Partial<Record<QuizCategoryKey, string[]>> = {};

function shuffleArray<T>(items: T[]) {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export default function QuizGame({
  mode,
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
}: {
  mode: PlayMode;
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
}) {
  const [category, setCategory] = useState<QuizCategoryKey | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showWinnerPick, setShowWinnerPick] = useState(false);

  const [side1Correct, setSide1Correct] = useState(0);
  const [side2Correct, setSide2Correct] = useState(0);

  function pickQuestions(cat: QuizCategoryKey) {
    const all = quizQuestions[cat];
    const lastRoundQuestions = LAST_ROUND_QUESTIONS[cat] ?? [];

    let pool = all.filter((q) => !lastRoundQuestions.includes(q.question));

    if (pool.length < 5) {
      pool = all;
    }

    const selected = shuffleArray(pool).slice(0, 5);

    LAST_ROUND_QUESTIONS[cat] = selected.map((q) => q.question);

    return selected;
  }

  useEffect(() => {
    setCategory(null);
    setQuestions([]);
    setIndex(0);
    setShowAnswer(false);
    setShowWinnerPick(false);
    setSide1Correct(0);
    setSide2Correct(0);
  }, [roundKey]);

  function handleSelectCategory(cat: QuizCategoryKey) {
    const picked = pickQuestions(cat);

    setCategory(cat);
    setQuestions(picked);
    setIndex(0);
    setShowAnswer(false);
    setShowWinnerPick(false);
    setSide1Correct(0);
    setSide2Correct(0);
  }

  function handleWinnerPick(winner: WinnerType) {
    const nextSide1 = winner === "side1" ? side1Correct + 1 : side1Correct;
    const nextSide2 = winner === "side2" ? side2Correct + 1 : side2Correct;

    if (winner === "side1") {
      setSide1Correct(nextSide1);
    }

    if (winner === "side2") {
      setSide2Correct(nextSide2);
    }

    setShowWinnerPick(false);

    if (index >= questions.length - 1) {
      if (nextSide1 > nextSide2) {
        onRoundEnd("side1");
        return;
      }

      if (nextSide2 > nextSide1) {
        onRoundEnd("side2");
        return;
      }

      onRoundEnd();
      return;
    }

    setIndex((prev) => prev + 1);
    setShowAnswer(false);
  }

  const categoryTitle =
    category === "seerah"
      ? "السيرة والأنبياء"
      : category === "saudi"
      ? "تاريخ السعودية"
      : "كرة القدم السعودية";

  if (!category) {
    return <QuizCategorySelect onSelect={handleSelectCategory} />;
  }

  const current = questions[index];

  if (!current) {
    return (
      <GlassCard className="min-h-[780px] p-8 text-center">
        <p className="text-xl font-black">ما فيه أسئلة كفاية في هذه الفئة</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="min-h-[780px] p-8 text-center">
      <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
        QUIZ
      </p>

      <h2 className="mt-2 text-3xl font-black">الأسئلة</h2>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-sm text-white/60">الفئة</p>
          <p className="mt-1 text-xl font-black text-yellow-200">
            {categoryTitle}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-sm text-white/60">السؤال</p>
          <p className="mt-1 text-xl font-black text-cyan-200">
            {index + 1} / {questions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-sm text-white/60">النتيجة الحالية</p>
          <p className="mt-1 text-xl font-black">
            {side1Name} {side1Correct} - {side2Correct} {side2Name}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_0_18px_rgba(255,255,255,0.04)]">
        <p className="text-2xl font-black leading-relaxed text-white">
          {current.question}
        </p>

        {current.options && current.options.length > 0 && (
          <div className="mt-6 grid gap-3">
            {current.options.map((opt) => (
              <div
                key={opt}
                className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-lg font-bold text-white"
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>

      {!showAnswer ? (
        <div className="mt-8">
          <button
            onClick={() => setShowAnswer(true)}
            className="btn-primary min-w-[200px]"
          >
            إظهار الإجابة
          </button>
        </div>
      ) : !showWinnerPick ? (
        <div className="mt-8">
          <div className="rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
            <p className="text-sm text-white/70">الإجابة الصحيحة</p>
            <p className="mt-2 text-2xl font-black text-yellow-100">
              {current.answer}
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowWinnerPick(true)}
              className="btn-primary min-w-[220px]"
            >
              مين جاوب صح؟
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
            <p className="text-xl font-black">مين جاوب صح؟</p>
            <p className="mt-2 text-white/70">
              {mode === "teams"
                ? "اختر الفريق الذي جاوب السؤال بشكل صحيح"
                : "اختر اللاعب الذي جاوب السؤال بشكل صحيح"}
            </p>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleWinnerPick("side1")}
                className="btn-primary w-full"
              >
                {side1Name}
              </button>

              <button
                onClick={() => handleWinnerPick("side2")}
                className="btn-primary w-full"
              >
                {side2Name}
              </button>

              <button
                onClick={() => handleWinnerPick("none")}
                className="btn-secondary w-full"
              >
                لا أحد
              </button>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
