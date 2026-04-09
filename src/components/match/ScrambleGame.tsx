'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type PlayMode = "solo" | "teams";
type WinnerType = "side1" | "side2" | "none";

export default function ScrambleGame({
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
    { prompt: "طلع لي اسم أكلة", answer: "شكشوكة" },
    { prompt: "طلع لي اسم أكلة", answer: "بروستد" },
    { prompt: "طلع لي اسم براند", answer: "سامسونج" },
    { prompt: "طلع لي اسم براند", answer: "نايكي" },
    { prompt: "طلع لي اسم مدينة", answer: "الرياض" },
    { prompt: "طلع لي اسم مدينة", answer: "الدمام" },
    { prompt: "طلع لي اسم سيارة", answer: "تويوتا" },
    { prompt: "طلع لي اسم سيارة", answer: "مرسيدس" },
    { prompt: "طلع لي اسم سيارة", answer: "كورولا" },
    { prompt: "طلع لي اسم تطبيق", answer: "واتساب" },
    { prompt: "طلع لي اسم تطبيق", answer: "تيكتوك" },
    { prompt: "طلع لي اسم تطبيق", answer: "انستقرام" },
    { prompt: "طلع لي اسم لاعب", answer: "رونالدو" },
    { prompt: "طلع لي اسم لاعب", answer: "بنزيما" },
    { prompt: "طلع لي اسم لاعب", answer: "مبابي" },
  ];

  function shuffleWord(word: string) {
    let shuffled = word;

    while (shuffled === word) {
      const chars = word.split("");
      for (let i = chars.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      shuffled = chars.join("");
    }

    return shuffled.split("").join(" ");
  }

  const ROUND_TIME = 12;
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
    if (revealed || winnerSide) return;

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, revealed, winnerSide]);

  function finishRound() {
    if (winnerSide) {
      onRoundEnd(winnerSide);
      return;
    }
    onRoundEnd();
  }

  function markWinner(side: "side1" | "side2") {
    if (winnerSide || revealed) return;

    setWinnerSide(side);
    setWinnerTime(ROUND_TIME - timeLeft);

    setTimeout(() => {
      setRevealed(true);
    }, 700);
  }

  const statusText = winnerSide
    ? `الأسرع: ${winnerSide === "side1" ? side1Name : side2Name}`
    : revealed
    ? "انكشف الحل — أعلن النتيجة"
    : "الآن: رتب الحروف بأسرع وقت";

  const statusTone = winnerSide
    ? "border-yellow-300/25 bg-yellow-300/10 text-yellow-100"
    : revealed
    ? "border-cyan-300/20 bg-cyan-300/10 text-white"
    : "border-pink-300/20 bg-pink-500/10 text-white";

  const timerTextClass =
    timeLeft <= 4
      ? "font-black text-red-400 animate-pulse scale-110"
      : timeLeft <= 7
      ? "font-black text-yellow-300"
      : "font-black text-cyan-200";

  return (
    <GlassCard className="relative min-h-[780px] overflow-hidden border border-pink-400/25 bg-[#10001f]/75 p-8 text-center shadow-[0_0_28px_rgba(255,0,153,0.15)] backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/75">
          SCRAMBLE
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#98ffb6] drop-shadow-[0_0_14px_rgba(152,255,182,0.35)]">
          🧩 حروف بالخلاط
        </h2>

        <p className="mt-2 text-white/80">رتب الكلمة قبل غيرك</p>

        <div className={`mt-5 rounded-2xl border px-4 py-3 text-lg font-black ${statusTone}`}>
          {statusText}
        </div>

        <div className="mx-auto mt-5 w-full max-w-md">
          <div className="mb-1 flex justify-between text-sm text-white/80">
            <span>الوقت</span>
            <span className={timerTextClass}>{timeLeft}</span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300 transition-all duration-1000"
              style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_0_18px_rgba(255,255,255,0.04)]">
          <p className="text-sm text-white/60">التحدي</p>
          <p className="mt-2 text-xl font-black text-white">{current.prompt}</p>

          <div className="mt-6 rounded-2xl border border-pink-300/20 bg-pink-500/10 px-4 py-6">
            <div className="text-6xl font-black tracking-[0.5em] text-pink-300 drop-shadow-[0_0_20px_rgba(255,0,150,0.9)] md:text-7xl">
              {shuffled}
            </div>
          </div>
        </div>

        {!revealed && !winnerSide && (
          <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-white/80">
            أول واحد يفكها يضغط <span className="font-black text-white">{readyLabel}</span>
          </div>
        )}

        {winnerSide && (
          <div className="mt-6 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-4 text-center shadow-[0_0_18px_rgba(250,204,21,0.12)]">
            <p className="text-lg font-black text-yellow-100">
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
          <div
            className={`rounded-3xl border p-4 text-center transition ${
              winnerSide === "side1"
                ? "scale-105 border-pink-300/40 bg-pink-500/20 shadow-[0_0_22px_rgba(236,72,153,0.2)] animate-pulse"
                : winnerSide
                ? "border-pink-400/20 bg-pink-500/10 opacity-35 grayscale"
                : "border-pink-400/20 bg-pink-500/10"
            }`}
          >
            <p className="text-lg font-black">{side1Name}</p>
            <p className="mt-2 text-sm text-white/80">
              {winnerSide === "side1"
                ? "✅ سجّل أولًا"
                : winnerSide
                ? "انتهت الجولة"
                : "⏳ جاهز للتسجيل"}
            </p>

            <button
              type="button"
              onClick={() => markWinner("side1")}
              disabled={!!winnerSide || revealed}
              className="btn-primary mt-4 w-full disabled:opacity-50"
            >
              {readyLabel}
            </button>
          </div>

          <div
            className={`rounded-3xl border p-4 text-center transition ${
              winnerSide === "side2"
                ? "scale-105 border-cyan-300/40 bg-cyan-400/20 shadow-[0_0_22px_rgba(34,211,238,0.2)] animate-pulse"
                : winnerSide
                ? "border-cyan-300/20 bg-cyan-400/10 opacity-35 grayscale"
                : "border-cyan-300/20 bg-cyan-400/10"
            }`}
          >
            <p className="text-lg font-black">{side2Name}</p>
            <p className="mt-2 text-sm text-white/80">
              {winnerSide === "side2"
                ? "✅ سجّل أولًا"
                : winnerSide
                ? "انتهت الجولة"
                : "⏳ جاهز للتسجيل"}
            </p>

            <button
              type="button"
              onClick={() => markWinner("side2")}
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
            disabled={revealed}
            className="btn-secondary disabled:opacity-50"
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
          <div className="winner-animated mt-6 rounded-2xl border border-white/15 bg-white/10 p-5">
            <p className="text-sm text-white/70">الإجابة الصحيحة</p>
            <p className="mt-2 text-4xl font-black text-white">{current.answer}</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
