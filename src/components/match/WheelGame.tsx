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
  { label: "خسارة الدور", value: "lose" as Value, color: "#6b7280" },
];

const PUZZLES = [
  { answer: "معصوب", category: "أكلة" },
  { answer: "سويسرا", category: "دولة" },
  { answer: "قوتشي", category: "براند" },
  { answer: "تاهو", category: "سيارة" },
  { answer: "ريدبول", category: "مشروب" },
  { answer: "مبابي", category: "لاعب" },
  { answer: "يوتيوب", category: "تطبيق" },
  { answer: "وينديز", category: "مطعم" },
  { answer: "شكشوكة", category: "أكلة" },
  { answer: "المكسيك", category: "دولة" },
  { answer: "كارتير", category: "براند" },
  { answer: "كورولا", category: "سيارة" },
  { answer: "شاهي", category: "مشروب" },
  { answer: "بنزيما", category: "لاعب" },
  { answer: "واتساب", category: "تطبيق" },
  { answer: "بيتالشواية", category: "مطعم" },
];

const LETTER_ROWS = [
  "دجحخهعغفقثصض",
  "طكمنتالبيسش",
  "ذظزور",
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

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const segmentAngle = 360 / SEGMENTS.length;
  const currentTeamName = turn === "side1" ? side1Name : side2Name;

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
    const extraSpins = 8 * 360;
    const nextRotation =
      rotation +
      extraSpins +
      (360 - (rotation % 360)) +
      (360 - targetCenter);

    setRotation(nextRotation);

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
      }, 900);
    }, 3000);
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

    const guess = window.prompt("اكتب الكلمة كاملة");
    if (!guess) return;

    if (normalizeArabic(guess) === normalizeArabic(answer)) {
      finishRound(turn);
      return;
    }

    setCurrentValue(null);
    nextTurn();
    setPhase("spin");
  }

  return (
    <GlassCard className="relative overflow-hidden border border-pink-400/25 bg-[#10001f]/75 p-6 text-center shadow-[0_0_28px_rgba(255,0,153,0.15)] backdrop-blur-md min-h-[760px] md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/75">
          WHEEL
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#98ffb6] drop-shadow-[0_0_14px_rgba(152,255,182,0.35)]">
          🎡 لف وخمن
        </h2>

        <p className="mt-2 text-white/75">الفئة: {category}</p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-pink-400/20 bg-pink-500/10 px-4 py-4">
            <p className="text-sm text-white/60">{side1Name}</p>
            <p className="mt-2 text-3xl font-black text-yellow-200">{score1}</p>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-4">
            <p className="text-sm text-white/60">الدور الحالي</p>
            <p className="mt-2 text-2xl font-black">{currentTeamName}</p>
          </div>

          <div className="rounded-2xl border border-pink-400/20 bg-pink-500/10 px-4 py-4">
            <p className="text-sm text-white/60">{side2Name}</p>
            <p className="mt-2 text-3xl font-black text-yellow-200">{score2}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-lg font-bold">
          {phase === "result"
            ? `النتيجة: ${formatValue(currentValue)}`
            : phase === "guess"
            ? `النتيجة: ${formatValue(currentValue)} — اختر حرفًا`
            : phase === "celebrate"
            ? "🏆 انتهت الجولة!"
            : `الدور: ${currentTeamName} — لف العجلة`}
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {revealed.map((letter, i) => (
            <div
              key={i}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-black text-white shadow-[0_0_12px_rgba(255,255,255,0.04)]"
            >
              {letter || "_"}
            </div>
          ))}
        </div>

        {(phase === "spin" || phase === "result") && (
          <div className="mt-6 flex flex-col items-center">
            <div className="relative h-72 w-72">
              <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-3 text-3xl">
                🔻
              </div>

              <div
                className="relative h-full w-full rounded-full border-4 border-white/25 shadow-[0_0_28px_rgba(255,255,255,0.08)]"
                style={{
                  background: `conic-gradient(${SEGMENTS.map((s, i) => {
                    const start = i * segmentAngle;
                    const end = (i + 1) * segmentAngle;
                    return `${s.color} ${start}deg ${end}deg`;
                  }).join(", ")})`,
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 3s cubic-bezier(0.08, 0.9, 0.2, 1)",
                }}
              >
                {SEGMENTS.map((segment, i) => {
                  const angle = i * segmentAngle + segmentAngle / 2;

                  return (
                    <div
                      key={`${segment.label}-${i}`}
                      className="absolute left-1/2 top-1/2 origin-center"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-104px) rotate(${-angle}deg)`,
                      }}
                    >
                      <div className="w-20 text-center text-base font-black leading-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                        {segment.label}
                      </div>
                    </div>
                  );
                })}

                <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/25 bg-[#7a001f] text-xl shadow-lg">
                  🎡
                </div>
              </div>
            </div>

            <button
              onClick={spinWheel}
              disabled={phase !== "spin" || spinning}
              className="btn-primary mt-4 min-w-[160px] disabled:opacity-50"
            >
              {spinning ? "العجلة تدور..." : "لف"}
            </button>
          </div>
        )}

        {phase === "guess" && (
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              {LETTER_ROWS.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`flex justify-center gap-2 ${
                    rowIndex === 1 ? "mr-5" : rowIndex === 2 ? "mr-10" : ""
                  }`}
                >
                  {row.split("").map((letter) => {
                    const isUsed = usedLetters.includes(letter);

                    return (
                      <button
                        key={letter}
                        onClick={() => pickLetter(letter)}
                        disabled={isUsed}
                        className={`h-12 min-w-[46px] rounded-xl px-3 text-base font-bold transition ${
                          isUsed
                            ? "bg-white/5 text-white/25"
                            : "bg-white/10 text-white hover:bg-pink-500/25 hover:shadow-[0_0_16px_rgba(255,0,153,0.16)] active:scale-95"
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div>
              <button onClick={solveWord} className="btn-primary min-w-[160px]">
                حل الكلمة
              </button>
            </div>
          </div>
        )}

        {phase === "celebrate" && (
          <div className="mt-8">
            <div className="rounded-3xl border border-yellow-300/40 bg-yellow-400/15 px-6 py-8 shadow-[0_0_28px_rgba(250,204,21,0.16)]">
              <p className="text-5xl">🏆</p>
              <p className="mt-4 text-3xl font-black text-yellow-100">
                {winnerName}
              </p>
              <p className="mt-2 text-lg text-white/85">فاز بالجولة!</p>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
