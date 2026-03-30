'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type WinnerType = "side1" | "side2";

export function WheelGame({
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

  const WORDS = [
    { category: "أكلة", answer: "شاورما" },
    { category: "مدينة", answer: "الرياض" },
    { category: "براند", answer: "ابل" },
    { category: "سيارة", answer: "تويوتا" },
    { category: "مشروب", answer: "قهوة" },
  ];

  const WHEEL = [100, 200, 300, 500, "bankrupt", "lose"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

  const [revealed, setRevealed] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);

  const [turn, setTurn] = useState<"side1" | "side2">("side1");
  const [spinResult, setSpinResult] = useState<number | string | null>(null);

  const [side1Score, setSide1Score] = useState(0);
  const [side2Score, setSide2Score] = useState(0);

  const alphabet = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");

  useEffect(() => {
    const i = Math.floor(Math.random() * WORDS.length);
    setCurrentIndex(i);
    setAnswer(WORDS[i].answer);
    setCategory(WORDS[i].category);
    setRevealed(Array(WORDS[i].answer.length).fill(""));
    setUsedLetters([]);
    setSpinResult(null);
    setTurn("side1");
  }, [roundKey]);

  function spinWheel() {
    const result = WHEEL[Math.floor(Math.random() * WHEEL.length)];
    setSpinResult(result);

    if (result === "bankrupt") {
      if (turn === "side1") setSide1Score(0);
      else setSide2Score(0);

      setTurn(turn === "side1" ? "side2" : "side1");
    }

    if (result === "lose") {
      setTurn(turn === "side1" ? "side2" : "side1");
    }
  }

  function pickLetter(letter: string) {
    if (!spinResult || typeof spinResult !== "number") return;
    if (usedLetters.includes(letter)) return;

    setUsedLetters((prev) => [...prev, letter]);

    let count = 0;
    const updated = [...revealed];

    answer.split("").forEach((char, i) => {
      if (char === letter) {
        updated[i] = letter;
        count++;
      }
    });

    setRevealed(updated);

    if (count > 0) {
      const gained = count * spinResult;

      if (turn === "side1") setSide1Score((s) => s + gained);
      else setSide2Score((s) => s + gained);

    } else {
      setTurn(turn === "side1" ? "side2" : "side1");
    }

    setSpinResult(null);
  }

  function solveWord() {
    const guess = prompt("اكتب الكلمة:");
    if (!guess) return;

    if (guess === answer) {
      onRoundEnd(turn);
    } else {
      setTurn(turn === "side1" ? "side2" : "side1");
    }
  }

  return (
    <GlassCard className="min-h-[750px] p-6 text-center">

      <h2 className="text-3xl font-black">🎡 لف وخمّن</h2>
      <p className="mt-2 text-white/70">الفئة: {category}</p>

      {/* الكلمة */}
      <div className="mt-6 flex justify-center gap-2 flex-wrap">
        {revealed.map((l, i) => (
          <div
            key={i}
            className="h-14 w-14 flex items-center justify-center rounded-xl bg-white/10 text-2xl font-black"
          >
            {l || "_"}
          </div>
        ))}
      </div>

      {/* الدور */}
      <p className="mt-4 text-lg">
        الدور على: {turn === "side1" ? side1Name : side2Name}
      </p>

      {/* العجلة */}
      <div className="mt-4">
        <button onClick={spinWheel} className="btn-primary">
          لف العجلة
        </button>

        {spinResult && (
          <p className="mt-3 text-xl font-black">
            {spinResult === "bankrupt"
              ? "💸 إفلاس!"
              : spinResult === "lose"
              ? "❌ خسارة الدور"
              : `+${spinResult}`}
          </p>
        )}
      </div>

      {/* الحروف */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {alphabet.map((l) => (
          <button
            key={l}
            onClick={() => pickLetter(l)}
            disabled={usedLetters.includes(l) || !spinResult}
            className="px-3 py-2 bg-white/10 rounded-lg disabled:opacity-30"
          >
            {l}
          </button>
        ))}
      </div>

      {/* حل الكلمة */}
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={solveWord} className="btn-primary">
          حل الكلمة
        </button>

        <button onClick={() => onRoundEnd()} className="btn-secondary">
          إنهاء الجولة
        </button>
      </div>

      {/* النقاط */}
      <div className="mt-6 flex justify-between text-lg">
        <div>{side1Name}: {side1Score}</div>
        <div>{side2Name}: {side2Score}</div>
      </div>

    </GlassCard>
  );
}
