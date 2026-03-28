'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type PlayMode = "solo" | "teams";
type WinnerType = "side1" | "side2" | "none";

export function CategoriesGame({
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
  const ROUND_TIME = 40;
  const letters = ["م", "س", "ب", "ر", "ن", "ل", "ك"];
  const [letter, setLetter] = useState(() => letters[Math.floor(Math.random() * letters.length)]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [revealed, setRevealed] = useState(false);

  const [side1Ready, setSide1Ready] = useState(false);
  const [side2Ready, setSide2Ready] = useState(false);
  const [side1Time, setSide1Time] = useState<number | null>(null);
  const [side2Time, setSide2Time] = useState<number | null>(null);

  const readyLabel = mode === "teams" ? "خلصنا" : "خلصت";

  const instructionText =
    mode === "teams"
      ? 'فكروا في: إنسان – حيوان – نبات – جماد – بلاد، كلها بنفس الحرف. إذا انتهى الفريق، يقول لصاحب الجلسة: "خلصنا" ثم يسجلها صاحب الجلسة'
      : 'فكر في: إنسان – حيوان – نبات – جماد – بلاد، كلها بنفس الحرف. إذا انتهى اللاعب، يقول لصاحب الجلسة: "خلصت" ثم يسجلها صاحب الجلسة';

  useEffect(() => {
    const next = letters[Math.floor(Math.random() * letters.length)];
    setLetter(next);
    setTimeLeft(ROUND_TIME);
    setRevealed(false);
    setSide1Ready(false);
    setSide2Ready(false);
    setSide1Time(null);
    setSide2Time(null);
  }, [roundKey]);

  useEffect(() => {
    if (revealed) return;

    if (side1Ready && side2Ready) {
      setRevealed(true);
      return;
    }

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, revealed, side1Ready, side2Ready]);

  return (
    <GlassCard className="min-h-[780px] p-8 text-center">
      <h2 className="text-2xl font-black">إنسان حيوان نبات جماد بلاد</h2>

      <div className="mt-6 flex justify-center">
        <div className="rounded-[30px] bg-white px-12 py-8 text-7xl font-black text-red-500 shadow-xl">
          {letter}
        </div>
      </div>

      <div className="mt-4 w-full max-w-md mx-auto">
        <div className="mb-1 flex justify-between text-sm text-white/80">
          <span>الوقت</span>
          <span>{timeLeft}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-white transition-all duration-1000"
            style={{ width: `${(timeLeft / 40) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-6 text-center">
        <p className="text-lg font-black">تعليمات الجولة</p>
        <p className="mt-3 leading-8 text-white/80">{instructionText}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{side1Name}</p>
          <p className="mt-2 text-sm text-white/80">
            {side1Ready ? "✅ تم التسجيل" : "⏳ لم يسجل بعد"}
          </p>
          {side1Time !== null && (
            <p className="mt-1 text-xs text-white/70">تم تسجيله خلال {side1Time} ثانية</p>
          )}
          <button
            type="button"
            onClick={() => {
              setSide1Ready(true);
              setSide1Time(ROUND_TIME - timeLeft);
            }}
            disabled={side1Ready || revealed}
            className="btn-primary mt-4 w-full disabled:opacity-50"
          >
            {readyLabel}
          </button>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{side2Name}</p>
          <p className="mt-2 text-sm text-white/80">
            {side2Ready ? "✅ تم التسجيل" : "⏳ لم يسجل بعد"}
          </p>
          {side2Time !== null && (
            <p className="mt-1 text-xs text-white/70">تم تسجيله خلال {side2Time} ثانية</p>
          )}
          <button
            type="button"
            onClick={() => {
              setSide2Ready(true);
              setSide2Time(ROUND_TIME - timeLeft);
            }}
            disabled={side2Ready || revealed}
            className="btn-primary mt-4 w-full disabled:opacity-50"
          >
            {readyLabel}
          </button>
        </div>
      </div>

      {revealed && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black animate-pulse">🚫 انتهى الوقت – وقت الإعلان</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => onRoundEnd()}
          disabled={!revealed}
          className="btn-primary disabled:opacity-50"
        >
          إنهاء الجولة
        </button>
      </div>
    </GlassCard>
  );
}
