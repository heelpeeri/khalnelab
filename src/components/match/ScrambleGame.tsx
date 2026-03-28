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
    { prompt: "طلع لي اسم براند", answer: "ابل" },
    { prompt: "طلع لي اسم مدينة", answer: "الرياض" },
    { prompt: "طلع لي اسم سيارة", answer: "تويوتا" },
    { prompt: "طلع لي اسم بنت", answer: "نورة" },
    { prompt: "طلع لي اسم تطبيق", answer: "سناب" },
    { prompt: "طلع لي اسم لاعب", answer: "ميسي" },
  ];

  function shuffleWord(word: string) {
    const chars = word.split("");
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join(" ");
  }

  const ROUND_TIME = 15;

  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUESTIONS.length));
  const current = useMemo(() => QUESTIONS[index], [index]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [winner, setWinner] = useState<"side1" | "side2" | null>(null);
  const [shuffled, setShuffled] = useState(() => shuffleWord(current.answer));

  useEffect(() => {
    const nextIndex = Math.floor(Math.random() * QUESTIONS.length);
    setIndex(nextIndex);
    setShuffled(shuffleWord(QUESTIONS[nextIndex].answer));
    setTimeLeft(ROUND_TIME);
    setWinner(null);
  }, [roundKey]);

  useEffect(() => {
    if (winner) return;

    if (timeLeft <= 0) {
      onRoundEnd();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, winner, onRoundEnd]);

  function handleWin(side: "side1" | "side2") {
    if (winner) return;
    setWinner(side);

    setTimeout(() => {
      onRoundEnd(side);
    }, 1200);
  }

  return (
    <GlassCard className="min-h-[780px] p-8 text-center">
      <h2 className="text-3xl font-black">🧩 حروف بالخلاط</h2>
      <p className="mt-2 text-white/80">⚡ أول واحد يحلها يفوز!</p>

      <div className="mt-4 text-lg">⏳ {timeLeft}</div>

      <div className="mt-8">
        <p className="text-xl font-black">{current.prompt}</p>
        <div className="mt-6 text-6xl font-black tracking-[0.4em]">
          {shuffled}
        </div>
      </div>

      {winner && (
        <div className="mt-8 text-2xl font-black animate-bounce">
          🚀 الفائز: {winner === "side1" ? side1Name : side2Name}
        </div>
      )}

      {!winner && (
        <div className="mt-10 grid grid-cols-2 gap-4">
          <button
            onClick={() => handleWin("side1")}
            className="btn-primary"
          >
            {side1Name}
          </button>

          <button
            onClick={() => handleWin("side2")}
            className="btn-primary"
          >
            {side2Name}
          </button>
        </div>
      )}
    </GlassCard>
  );
}
