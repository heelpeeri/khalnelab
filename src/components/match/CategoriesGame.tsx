'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

export default function CategoriesGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: () => void;
  roundKey: number;
}) {
  const letters = ["م", "س", "ب", "ر", "ن"];
  const [letter, setLetter] = useState("م");
  const [timeLeft, setTimeLeft] = useState(40);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setLetter(letters[Math.floor(Math.random() * letters.length)]);
    setTimeLeft(40);
    setRevealed(false);
  }, [roundKey]);

  useEffect(() => {
    if (revealed) return;

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, revealed]);

  return (
    <GlassCard className="text-center">
      <h2 className="text-3xl font-black">إنسان حيوان نبات</h2>

      <div className="text-6xl mt-6">{letter}</div>

      <p className="mt-4">الوقت: {timeLeft}</p>

      {revealed && (
        <p className="mt-4 text-yellow-300">انتهى الوقت</p>
      )}

      <button
        className="btn-primary mt-6"
        onClick={() => onRoundEnd()}
      >
        إنهاء الجولة
      </button>
    </GlassCard>
  );
}
