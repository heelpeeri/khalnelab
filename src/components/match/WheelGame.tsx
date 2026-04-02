'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type WinnerType = "side1" | "side2";
type Turn = "side1" | "side2";
type Phase = "spin" | "result" | "guess" | "celebrate";
type Value = number | "bankrupt" | "lose";

const SEGMENTS = [
  { label: "100", value: 100 as Value, color: "#22c55e" },
  { label: "200", value: 200 as Value, color: "#3b82f6" },
  { label: "300", value: 300 as Value, color: "#a855f7" },
  { label: "500", value: 500 as Value, color: "#f59e0b" },
  { label: "إفلاس", value: "bankrupt" as Value, color: "#ef4444" },
  { label: "خسارة", value: "lose" as Value, color: "#6b7280" },
];

const PUZZLES = [
  { answer: "شاورما", category: "أكلة" },
  { answer: "الرياض", category: "مدينة" },
  { answer: "ابل", category: "براند" },
  { answer: "تويوتا", category: "سيارة" },
  { answer: "قهوة", category: "مشروب" },
  { answer: "ميسي", category: "لاعب" },
  { answer: "سناب", category: "تطبيق" },
  { answer: "البيك", category: "مطعم" },
];

const LETTER_ROWS = [
  "ضصثقفغعهخحجد",
  "شسيبلاتنمكط",
  "ئءؤرلاىةوزظ",
];

function normalizeArabic(text: string) {
  return text
    .trim()
    .replace(/\s+/g, "")
    .replace(/أ|إ|آ/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

function formatValue(value: Value | null) {
  if (value === null) return "لف العجلة";
  if (value === "bankrupt") return "💸 إفلاس";
  if (value === "lose") return "❌ خسارة الدور";
  return `+${value}`;
}

export default function WheelGame({
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
  const [turn, setTurn] = useState<Turn>("side1");
  const [phase, setPhase] = useState<Phase>("spin");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const [currentValue, setCurrentValue] = useState<Value | null>(null);
  const [winnerName, setWinnerName] = useState("");

  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [solveInput, setSolveInput] = useState("");

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const segmentAngle = 360 / SEGMENTS.length;

  useEffect(() => {
    const q = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    setAnswer(q.answer);
    setCategory(q.category);
    setRevealed(Array(q.answer.length).fill(""));
    setUsedLetters([]);
    setTurn("side1");
    setPhase("spin");
    setRotation(0);
    setSpinning(false);
    setCurrentValue(null);
    setWinnerName("");
    setSolveInput("");
  }, [roundKey]);

  function nextTurn() {
    setTurn((prev) => (prev === "side1" ? "side2" : "side1"));
  }

  function finishRound(winner: WinnerType) {
    setWinnerName(winner === "side1" ? side1Name : side2Name);
    setPhase("celebrate");

    setTimeout(() => {
      onRoundEnd(winner);
    }, 1400);
  }

  function spinWheel() {
    if (spinning || phase !== "spin") return;

    setSpinning(true);

    const index = Math.floor(Math.random() * SEGMENTS.length);
    const value = SEGMENTS[index].value;
    setCurrentValue(value);

    const targetCenter = index * segmentAngle + segmentAngle / 2;
    const finalRotation = 6 * 360 + (360 - targetCenter);

    setRotation(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRotation(finalRotation);
      });
    });

    setTimeout(() => {
      setSpinning(false);
      setPhase("result");

      setTimeout(() => {
        if (value === "bankrupt") {
          turn === "side1" ? setScore1(0) : setScore2(0);
          setCurrentValue(null);
          nextTurn();
          setPhase("spin");
          return;
        }

        if (value === "lose") {
          setCurrentValue(null);
          nextTurn();
          setPhase("spin");
          return;
        }

        setPhase("guess");
      }, 1200);
    }, 2000);
  }

  function pickLetter(letter: string) {
    if (phase !== "guess") return;
    if (usedLetters.includes(letter)) return;
    if (typeof currentValue !== "number") return;

    setUsedLetters((prev) => [...prev, letter]);

    let count = 0;
    const next = [...revealed];

    answer.split("").forEach((char, i) => {
      if (normalizeArabic(char) === normalizeArabic(letter)) {
        next[i] = char;
        count++;
      }
    });

    setRevealed(next);

    if (count > 0) {
      const gained = count * currentValue;

      turn === "side1"
        ? setScore1((s) => s + gained)
        : setScore2((s) => s + gained);

      if (next.every((l) => l !== "")) {
        finishRound(turn);
      }

      return;
    }

    setCurrentValue(null);
    nextTurn();
    setPhase("spin");
  }

  function solveWord() {
    if (phase === "celebrate") return;

    const guess = normalizeArabic(solveInput);
    if (!guess) return;

    if (guess === normalizeArabic(answer)) {
      finishRound(turn);
      return;
    }

    setSolveInput("");
    setCurrentValue(null);
    nextTurn();
    setPhase("spin");
  }

  const currentTeamName = turn === "side1" ? side1Name : side2Name;

  return (
    <GlassCard className="min-h-[820px] p-6 text-center">
      <h2 className="text-3xl font-black">🎡 لف وخمن</h2>
      <p className="mt-2 text-white/70">{category}</p>

      <div className="mt-4 font-bold">
        {phase === "result"
          ? `النتيجة: ${formatValue(currentValue)}`
          : `الدور: ${currentTeamName}`}
      </div>

      {(phase === "spin" || phase === "result") && (
        <>
          <div className="mt-6 relative h-64 w-64 mx-auto">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 text-2xl">🔻</div>

            <div
              className="h-full w-full rounded-full"
              style={{
                background: `conic-gradient(${SEGMENTS.map((s, i) => {
                  const start = i * segmentAngle;
                  const end = (i + 1) * segmentAngle;
                  return `${s.color} ${start}deg ${end}deg`;
                }).join(", ")})`,
                transform: `rotate(${rotation}deg)`,
                transition: "transform 2s ease-out",
              }}
            />
          </div>

          <button onClick={spinWheel} className="btn-primary mt-4">
            لف
          </button>
        </>
      )}

      {phase === "guess" && (
        <div className="mt-6 space-y-2">
          {LETTER_ROWS.map((row) => (
            <div key={row} className="flex justify-center gap-2">
              {row.split("").map((l) => (
                <button
                  key={l}
                  onClick={() => pickLetter(l)}
                  className="btn-secondary"
                >
                  {l}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center gap-2">
        {revealed.map((l, i) => (
          <div key={i} className="w-10 h-10 bg-white/10 flex items-center justify-center">
            {l || "_"}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <input
          value={solveInput}
          onChange={(e) => setSolveInput(e.target.value)}
          className="input text-black"
          placeholder="حل الكلمة"
        />
        <button onClick={solveWord} className="btn-primary mt-2">
          حل
        </button>
      </div>

      <div className="mt-6">
        {side1Name}: {score1} | {side2Name}: {score2}
      </div>
    </GlassCard>
  );
}
