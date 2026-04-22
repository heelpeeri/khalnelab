'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import QuizCategorySelect from "@/components/match/QuizCategorySelect";
import {
  quizQuestions,
  QuizCategoryKey,
  QuizQuestion,
} from "@/lib/quizQuestions";

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
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
  onProgressChange,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  onProgressChange?: (current: number, total: number) => void;
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
    onProgressChange?.(0, 0);
  }, [roundKey]);

  useEffect(() => {
    if (!category || questions.length === 0) {
      onProgressChange?.(0, 0);
      return;
    }

    onProgressChange?.(index + 1, questions.length);
  }, [category, index, questions, onProgressChange]);

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
    let newSide1 = side1Correct;
    let newSide2 = side2Correct;

    if (winner === "side1") {
      newSide1 += 1;
      setSide1Correct(newSide1);
    }

    if (winner === "side2") {
      newSide2 += 1;
      setSide2Correct(newSide2);
    }

    setShowWinnerPick(false);

    if (index >= questions.length - 1) {
      if (newSide1 > newSide2) {
        onRoundEnd("side1");
        return;
      }

      if (newSide2 > newSide1) {
        onRoundEnd("side2");
        return;
      }

      onRoundEnd("none");
      return;
    }

    setIndex((prev) => prev + 1);
    setShowAnswer(false);
    setShowWinnerPick(false);
  }

  if (!category) {
    return (
      <QuizCategorySelect
        key={`quiz-category-${roundKey}`}
        onSelect={handleSelectCategory}
      />
    );
  }

  const current = questions[index];

  if (!current) {
    return (
      <GlassCard className="min-h-[720px] p-8 text-center">
        <p className="text-xl font-black">ما فيه أسئلة كفاية في هذه الفئة</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="relative min-h-[720px] overflow-hidden border border-pink-400/20 bg-[#10001f]/75 p-5 text-center shadow-[0_0_28px_rgba(255,0,153,0.12)] backdrop-blur-md md:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/75">
          QUIZ
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">❓ الأسئلة</h2>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-pink-300/20 bg-pink-500/10 p-4">
            <p className="text-sm text-white/60">{side1Name}</p>
            <p className="mt-2 text-4xl font-black text-pink-200">
              {side1Correct}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 shadow-[0_0_18px_rgba(34,211,238,0.08)]">
            <p className="text-sm text-white/60">السؤال الحالي</p>
            <p
              dir="ltr"
              className="mt-2 text-3xl font-black text-cyan-200"
            >
              {index + 1} / {questions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-white/10 p-4">
            <p className="text-sm text-white/60">{side2Name}</p>
            <p className="mt-2 text-4xl font-black text-cyan-200">
              {side2Correct}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-lg font-black text-white">
          {!showAnswer
            ? "اقرأ السؤال ثم اكشف الإجابة"
            : !showWinnerPick
            ? "الإجابة ظهرت — اختر من جاوب صح"
            : "حدد الفريق الذي جاوب بشكل صحيح"}
        </div>

        <div className="mt-7 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-[0_0_18px_rgba(255,255,255,0.04)] md:p-6">
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
              type="button"
              onClick={() => setShowAnswer(true)}
              className="btn-primary min-w-[220px]"
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
                type="button"
                onClick={() => setShowWinnerPick(true)}
                className="btn-primary min-w-[220px]"
              >
                من جاوب صح؟
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-xl font-black">من جاوب صح؟</p>
              <p className="mt-2 text-white/70">
                اختر الفريق الذي أجاب بشكل صحيح
              </p>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => handleWinnerPick("side1")}
                  className="btn-primary w-full"
                >
                  {side1Name}
                </button>

                <button
                  type="button"
                  onClick={() => handleWinnerPick("side2")}
                  className="btn-primary w-full"
                >
                  {side2Name}
                </button>

                <button
                  type="button"
                  onClick={() => handleWinnerPick("none")}
                  className="btn-secondary w-full"
                >
                  لا أحد
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
