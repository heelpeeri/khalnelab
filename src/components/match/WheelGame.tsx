'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type Turn = "side1" | "side2";
type Phase = "spin" | "result" | "guess" | "celebrate";
type Value = number | "bankrupt" | "lose";

const SEGMENTS = [
  { label: "100", value: 100 },
  { label: "200", value: 200 },
  { label: "300", value: 300 },
  { label: "500", value: 500 },
  { label: "إفلاس", value: "bankrupt" },
  { label: "خسارة", value: "lose" },
];

const PUZZLES = [
  { answer: "شاورما", category: "أكلة" },
  { answer: "الرياض", category: "مدينة" },
  { answer: "ابل", category: "براند" },
];

export default function WheelGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
}: any) {
  const [turn, setTurn] = useState<Turn>("side1");
  const [phase, setPhase] = useState<Phase>("spin");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const [currentValue, setCurrentValue] = useState<Value | null>(null);

  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [used, setUsed] = useState<string[]>([]);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const letters = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");

  useEffect(() => {
    const q = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    setAnswer(q.answer);
    setRevealed(Array(q.answer.length).fill(""));
    setUsed([]);
    setTurn("side1");
    setPhase("spin");
  }, [roundKey]);

  function nextTurn() {
    setTurn((t) => (t === "side1" ? "side2" : "side1"));
  }

  function spin() {
    if (spinning || phase !== "spin") return;

    setSpinning(true);

    const index = Math.floor(Math.random() * SEGMENTS.length);
    const value = SEGMENTS[index].value;

    setCurrentValue(value);

    const angle = 360 / SEGMENTS.length;
    const target = index * angle + angle / 2;

    const newRot = rotation + 5 * 360 + (360 - target);
    setRotation(newRot);

    setTimeout(() => {
      setSpinning(false);
      setPhase("result");

      setTimeout(() => {
        if (value === "bankrupt") {
          if (turn === "side1") setScore1(0);
          else setScore2(0);
          nextTurn();
          setPhase("spin");
          return;
        }

        if (value === "lose") {
          nextTurn();
          setPhase("spin");
          return;
        }

        setPhase("guess");
      }, 1500);
    }, 2000);
  }

  function pick(letter: string) {
    if (phase !== "guess") return;
    if (used.includes(letter)) return;
    if (typeof currentValue !== "number") return;

    setUsed((u) => [...u, letter]);

    let count = 0;
    const next = [...revealed];

    answer.split("").forEach((c, i) => {
      if (c === letter) {
        next[i] = c;
        count++;
      }
    });

    setRevealed(next);

    if (count > 0) {
      const gain = count * currentValue;

      if (turn === "side1") setScore1((s) => s + gain);
      else setScore2((s) => s + gain);

      if (next.every((l) => l !== "")) {
        setPhase("celebrate");
        setTimeout(() => onRoundEnd(turn), 1500);
      }

      return;
    }

    nextTurn();
    setPhase("spin");
    setCurrentValue(null);
  }

  return (
    <GlassCard className="p-6 text-center">
      <h2 className="text-3xl font-black">🎡 لف وخمّن</h2>

      <div className="mt-4 text-xl">
        الدور: {turn === "side1" ? side1Name : side2Name}
      </div>

      {/* العجلة */}
      {(phase === "spin" || phase === "result") && (
        <div className="mt-6">
          <div
            className="mx-auto h-64 w-64 rounded-full border"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "transform 2s",
            }}
          />

          {phase === "result" && (
            <div className="mt-4 text-3xl font-black animate-bounce">
              {typeof currentValue === "number"
                ? `+${currentValue}`
                : currentValue === "bankrupt"
                ? "💸 إفلاس"
                : "❌ خسارة"}
            </div>
          )}

          <button
            onClick={spin}
            disabled={phase !== "spin"}
            className="btn-primary mt-4"
          >
            لف
          </button>
        </div>
      )}

      {/* الكلمة */}
      <div className="mt-6 flex justify-center gap-2">
        {revealed.map((l, i) => (
          <div key={i} className="border p-3 text-xl">
            {l || "_"}
          </div>
        ))}
      </div>

      {/* الكيبورد */}
      {phase === "guess" && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {letters.map((l) => (
            <button
              key={l}
              onClick={() => pick(l)}
              className="btn-secondary"
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {/* السكور */}
      <div className="mt-6 flex justify-center gap-6">
        <div>{side1Name}: {score1}</div>
        <div>{side2Name}: {score2}</div>
      </div>
    </GlassCard>
  );
}
