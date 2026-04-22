'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type WinnerType = "side1" | "side2" | "none";

export default function ScrambleGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
}) {
  const QUESTIONS = [
    { category: "أكلة", answer: "شاورما" },
    { category: "أكلة", answer: "شكشوكة" },
    { category: "براند", answer: "سامسونج" },
    { category: "مدينة", answer: "الرياض" },
    { category: "سيارة", answer: "تويوتا" },
    { category: "تطبيق", answer: "واتساب" },
    { category: "لاعب", answer: "رونالدو" },
  ];

  function shuffleWord(word: string) {
    let shuffled = word;

    while (shuffled === word) {
      const chars = word.split("");
      for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      shuffled = chars.join("");
    }

    return shuffled.split("").join(" ");
  }

  const ROUND_TIME = 12;

  const [index, setIndex] = useState(
    () => Math.floor(Math.random() * QUESTIONS.length)
  );

  const current = useMemo(() => QUESTIONS[index], [index]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [revealed, setRevealed] = useState(false);
  const [winner, setWinner] = useState<WinnerType>(null);

  const [shuffled, setShuffled] = useState(() =>
    shuffleWord(QUESTIONS[index].answer)
  );

  useEffect(() => {
    const next = Math.floor(Math.random() * QUESTIONS.length);
    setIndex(next);
    setShuffled(shuffleWord(QUESTIONS[next].answer));
    setTimeLeft(ROUND_TIME);
    setRevealed(false);
    setWinner(null);
  }, [roundKey]);

  useEffect(() => {
    if (revealed || winner) return;

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const t = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [timeLeft, revealed, winner]);

  function finishRound() {
    onRoundEnd(winner ?? "none");
  }

  function chooseWinner(side: WinnerType) {
    if (revealed) return;
    setWinner(side);
    setTimeout(() => setRevealed(true), 500);
  }

  return (
    <GlassCard className="p-5 text-center md:p-6">

      {/* العنوان */}
      <h2 className="text-2xl font-black">🧩 حروف بالخلاط</h2>

      {/* التصنيف (بسيط وواضح) */}
      <p className="mt-2 text-lg font-bold text-cyan-200">
        التصنيف: {current.category}
      </p>

      {/* التايمر */}
      <div className="mt-4 text-xl font-black">
        ⏱ {timeLeft}
      </div>

      {/* الكلمة */}
      <div className="mt-5 rounded-xl bg-white/10 p-4">
        <p className="text-4xl font-black tracking-[0.3em]">
          {shuffled}
        </p>
      </div>

      {/* اختيار الفائز */}
      {!revealed && (
        <div className="mt-6 grid grid-cols-2 gap-3">

          <button
            onClick={() => chooseWinner("side1")}
            className="btn-primary"
          >
            {side1Name}
          </button>

          <button
            onClick={() => chooseWinner("side2")}
            className="btn-primary"
          >
            {side2Name}
          </button>

        </div>
      )}

      {/* النتيجة */}
      {winner && (
        <p className="mt-4 text-lg font-bold text-yellow-300">
          الفائز: {winner === "side1" ? side1Name : side2Name}
        </p>
      )}

      {/* الإجابة */}
      {revealed && (
        <div className="mt-4">
          <p className="text-sm text-white/70">الإجابة:</p>
          <p className="text-2xl font-black">{current.answer}</p>
        </div>
      )}

      {/* زر إنهاء */}
      <button
        onClick={finishRound}
        className="btn-primary mt-5 w-full"
      >
        إنهاء الجولة
      </button>

    </GlassCard>
  );
}
