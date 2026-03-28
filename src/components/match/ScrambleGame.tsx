'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type PlayMode = "solo" | "teams";
type WinnerType = "side1" | "side2" | "none";

export function ScrambleGame({
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
  const QUESTIONS = [
    { prompt: "طلع لي اسم أكلة", answer: "شاورما" },
    { prompt: "طلع لي اسم أكلة", answer: "كبسة" },
    { prompt: "طلع لي اسم أكلة", answer: "بيتزا" },
    { prompt: "طلع لي اسم براند", answer: "ابل" },
    { prompt: "طلع لي اسم براند", answer: "سامسونج" },
    { prompt: "طلع لي اسم براند", answer: "نايكي" },
    { prompt: "طلع لي اسم مدينة", answer: "الرياض" },
    { prompt: "طلع لي اسم مدينة", answer: "جدة" },
    { prompt: "طلع لي اسم مدينة", answer: "دبي" },
    { prompt: "طلع لي اسم سيارة", answer: "تويوتا" },
    { prompt: "طلع لي اسم سيارة", answer: "نيسان" },
    { prompt: "طلع لي اسم سيارة", answer: "مرسيدس" },
    { prompt: "طلع لي اسم بنت", answer: "نورة" },
    { prompt: "طلع لي اسم بنت", answer: "سارة" },
    { prompt: "طلع لي اسم بنت", answer: "ريم" },
    { prompt: "طلع لي اسم تطبيق", answer: "سناب" },
    { prompt: "طلع لي اسم تطبيق", answer: "تيكتوك" },
    { prompt: "طلع لي اسم تطبيق", answer: "انستقرام" },
    { prompt: "طلع لي اسم لاعب", answer: "ميسي" },
    { prompt: "طلع لي اسم لاعب", answer: "رونالدو" },
  ];

  function shuffleWord(word: string) {
    const chars = word.split("");
    for (let i = chars.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join(" ");
  }

  const ROUND_TIME = 20;
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUESTIONS.length));
  const current = useMemo(() => QUESTIONS[index], [index]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [revealed, setRevealed] = useState(false);
  const [winnerSide, setWinnerSide] = useState<"side1" | "side2" | null>(null);
  const [winnerTime, setWinnerTime] = useState<number | null>(null);
  const [shuffled, setShuffled] = useState(() => shuffleWord(QUESTIONS[index].answer));

  const readyLabel = mode === "teams" ? "خلصنا" : "خلصت";

  useEffect(() => {
    const nextIndex = Math.floor(Math.random() * QUESTIONS.length);
    setIndex(nextIndex);
    setShuffled(shuffleWord(QUESTIONS[nextIndex].answer));
    setTimeLeft(ROUND_TIME);
    setRevealed(false);
    setWinnerSide(null);
    setWinnerTime(null);
  }, [roundKey]);

  useEffect(() => {
    if (revealed) return;

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, revealed]);

  function finishRound() {
    if (winnerSide) {
      onRoundEnd(winnerSide);
      return;
    }
    onRoundEnd();
  }

  return (
    <GlassCard className="min-h-[780px] p-8 text-center">
      <h2 className="text-2xl font-black">🧩 حروف بالخلاط</h2>
      <p className="mt-2 text-white/80">رتب الكلمة قبل غيرك</p>

      <div className="mt-4 w-full max-w-md mx-auto">
        <div className="mb-1 flex justify-between text-sm text-white/80">
          <span>الوقت</span>
          <span>{timeLeft}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-white transition-all duration-1000"
            style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-6">
        <p className="text-xl font-black">{current.prompt}</p>
        <div className="mt-6 text-5xl font-black tracking-[0.35em] text-white">
          {shuffled}
        </div>
      </div>

      {!revealed && !winnerSide && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-white/80">
          أول واحد يفكها يفوز
        </div>
      )}

      {winnerSide && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black text-white">
            ✅ الأسرع: {winnerSide === "side1" ? side1Name : side2Name}
          </p>
          {winnerTime !== null && (
            <p className="mt-1 text-sm text-white/70">
              تم التسجيل خلال {winnerTime} ثانية
            </p>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{side1Name}</p>
          <p className="mt-2 text-sm text-white/80">
            {winnerSide === "side1" ? "✅ سجّل أولًا" : "⏳ جاهز للتسجيل"}
          </p>
          <button
            type="button"
            onClick={() => {
              if (winnerSide) return;
              setWinnerSide("side1");
              setWinnerTime(ROUND_TIME - timeLeft);
            }}
            disabled={!!winnerSide || revealed}
            className="btn-primary mt-4 w-full disabled:opacity-50"
          >
            {readyLabel}
          </button>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{side2Name}</p>
          <p className="mt-2 text-sm text-white/80">
            {winnerSide === "side2" ? "✅ سجّل أولًا" : "⏳ جاهز للتسجيل"}
          </p>
          <button
            type="button"
            onClick={() => {
              if (winnerSide) return;
              setWinnerSide("side2");
              setWinnerTime(ROUND_TIME - timeLeft);
            }}
            disabled={!!winnerSide || revealed}
            className="btn-primary mt-4 w-full disabled:opacity-50"
          >
            {readyLabel}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="btn-primary"
        >
          إظهار الإجابة
        </button>

        <button
          type="button"
          onClick={finishRound}
          className="btn-primary"
        >
          إنهاء الجولة
        </button>
      </div>

      {revealed && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-5">
          <p className="text-sm text-white/70">الإجابة الصحيحة</p>
          <p className="mt-2 text-3xl font-black">{current.answer}</p>
        </div>
      )}
    </GlassCard>
  );
}
