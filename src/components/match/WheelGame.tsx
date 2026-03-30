'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type WinnerType = "side1" | "side2";

const segments = [
  { label: "100", value: 100, color: "#22c55e" },
  { label: "200", value: 200, color: "#3b82f6" },
  { label: "300", value: 300, color: "#a855f7" },
  { label: "💸", value: "bankrupt", color: "#ef4444" },
  { label: "500", value: 500, color: "#f59e0b" },
  { label: "❌", value: "lose", color: "#6b7280" },
];

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
  ];

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<any>(null);

  const [turn, setTurn] = useState<"side1" | "side2">("side1");

  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);

  const [side1Score, setSide1Score] = useState(0);
  const [side2Score, setSide2Score] = useState(0);

  const alphabet = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");

  useEffect(() => {
    const i = Math.floor(Math.random() * WORDS.length);
    const word = WORDS[i].answer;

    setAnswer(word);
    setCategory(WORDS[i].category);
    setRevealed(Array(word.length).fill(""));
    setUsedLetters([]);
    setSpinResult(null);
    setTurn("side1");
  }, [roundKey]);

  function spinWheel() {
    if (spinning) return;

    setSpinning(true);

    const randomDeg = 2000 + Math.random() * 2000;
    const newRotation = rotation + randomDeg;

    setRotation(newRotation);

    setTimeout(() => {
      const segmentAngle = 360 / segments.length;
      const normalized = newRotation % 360;
      const index = Math.floor((360 - normalized) / segmentAngle) % segments.length;

      const result = segments[index];
      setSpinResult(result.value);

      if (result.value === "bankrupt") {
        if (turn === "side1") setSide1Score(0);
        else setSide2Score(0);
        setTurn(turn === "side1" ? "side2" : "side1");
      }

      if (result.value === "lose") {
        setTurn(turn === "side1" ? "side2" : "side1");
      }

      setSpinning(false);
    }, 2000);
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
    <GlassCard className="p-6 text-center">

      <h2 className="text-3xl font-black">🎡 لف وخمّن</h2>
      <p className="text-white/70 mt-2">الفئة: {category}</p>

      {/* الكلمة */}
      <div className="mt-6 flex justify-center gap-2">
        {revealed.map((l, i) => (
          <div key={i} className="h-14 w-14 flex items-center justify-center bg-white/10 rounded-xl text-2xl font-black">
            {l || "_"}
          </div>
        ))}
      </div>

      {/* الدور */}
      <div className="mt-4 bg-white/10 rounded-xl py-2 font-bold">
        🎯 الدور: {turn === "side1" ? side1Name : side2Name}
      </div>

      {/* 🎡 عجلة حقيقية */}
      <div className="mt-8 flex justify-center relative">

        {/* المؤشر */}
        <div className="absolute -top-4 text-2xl">🔻</div>

        <div
          className="h-64 w-64 rounded-full border-4 border-white/20"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 2s ease-out" : "none",
            background: `conic-gradient(
              #22c55e 0deg 60deg,
              #3b82f6 60deg 120deg,
              #a855f7 120deg 180deg,
              #ef4444 180deg 240deg,
              #f59e0b 240deg 300deg,
              #6b7280 300deg 360deg
            )`,
          }}
        />
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className="btn-primary mt-4"
      >
        لف العجلة
      </button>

      {/* الحروف */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {alphabet.map((l) => (
          <button
            key={l}
            onClick={() => pickLetter(l)}
            disabled={usedLetters.includes(l) || !spinResult}
            className={`px-3 py-2 rounded-lg ${
              usedLetters.includes(l)
                ? "bg-white/5 text-white/30"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* حل */}
      <div className="mt-6">
        <button onClick={solveWord} className="btn-primary">
          حل الكلمة
        </button>
      </div>

      {/* النقاط */}
      <div className="mt-6 flex justify-between">
        <div>{side1Name}: {side1Score}</div>
        <div>{side2Name}: {side2Score}</div>
      </div>

    </GlassCard>
  );
}
