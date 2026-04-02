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
    const extraTurns = 5 + Math.floor(Math.random() * 3);
    const newRotation = rotation + extraTurns * 360 + (360 - targetCenter);

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setPhase("result");

      setTimeout(() => {
        if (value === "bankrupt") {
          if (turn === "side1") {
            setScore1(0);
          } else {
            setScore2(0);
          }
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
        count += 1;
      }
    });

    setRevealed(next);

    if (count > 0) {
      const gained = count * currentValue;

      if (turn === "side1") {
        setScore1((s) => s + gained);
      } else {
        setScore2((s) => s + gained);
      }

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
    <GlassCard className="min-h-[820px] p-6 text-center md:p-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-black">🎡 لف وخمن</h2>
        <p className="mt-2 text-white/75">الفئة: {category}</p>

        <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-lg font-bold">
          {phase === "celebrate"
            ? "🏆 انتهت الجولة!"
            : phase === "result"
            ? `النتيجة: ${formatValue(currentValue)}`
            : phase === "guess"
            ? "✍️ اختر حرفًا — وإذا جاوبت صح كمل لين تغلط"
            : `🎯 الدور على: ${currentTeamName} — لف العجلة`}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-right">
            <p className="text-sm text-white/60">{side1Name}</p>
            <p className="mt-2 text-4xl font-black text-white">{score1}</p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-right">
            <p className="text-sm text-white/60">{side2Name}</p>
            <p className="mt-2 text-4xl font-black text-white">{score2}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {revealed.map((letter, i) => (
            <div
              key={i}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-black"
            >
              {letter || "_"}
            </div>
          ))}
        </div>

        {(phase === "spin" || phase === "result") && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-base font-bold">
              {phase === "result"
                ? `النتيجة: ${formatValue(currentValue)}`
                : `الدور الحالي: ${currentTeamName}`}
            </div>

            <div className="relative h-72 w-72">
              <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-3 text-3xl">
                🔻
              </div>

              <div
                className="relative h-full w-full rounded-full border-4 border-white/30 shadow-2xl"
                style={{
                  background: `conic-gradient(${SEGMENTS.map((s, i) => {
                    const start = i * segmentAngle;
                    const end = (i + 1) * segmentAngle;
                    return `${s.color} ${start}deg ${end}deg`;
                  }).join(", ")})`,
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 2s cubic-bezier(0.2, 0.9, 0.2, 1)",
                }}
              >
                {SEGMENTS.map((segment, i) => {
                  const angle = i * segmentAngle + segmentAngle / 2;
                  return (
                    <div
                      key={`${segment.label}-${i}`}
                      className="absolute left-1/2 top-1/2 origin-center"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-105px) rotate(${-angle}deg)`,
                      }}
                    >
                      <div className="w-20 text-center text-xs font-black leading-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                        {segment.label}
                      </div>
                    </div>
                  );
                })}

                <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/30 bg-[#7a001f] text-lg font-black shadow-lg">
                  🎡
                </div>
              </div>
            </div>

            <button
              onClick={spinWheel}
              disabled={phase !== "spin" || spinning}
              className="btn-primary min-w-[160px] disabled:opacity-50"
            >
              {spinning ? "العجلة تدور..." : "لف العجلة"}
            </button>
          </div>
        )}

        {phase === "guess" && (
          <>
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-lg font-bold">
              النتيجة: {formatValue(currentValue)} — اختر حرفًا
            </div>

            <div className="mt-6 space-y-2">
              {LETTER_ROWS.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`flex justify-center gap-2 ${
                    rowIndex === 1 ? "mr-6" : rowIndex === 2 ? "mr-10" : ""
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
                            : "bg-white/10 text-white hover:bg-white/20 active:scale-95"
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}

        {phase !== "celebrate" && (
          <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-4">
            <p className="text-sm text-white/70">إذا عرفت الكلمة، اكتبها هنا</p>

            <div className="mt-3 flex flex-col items-center justify-center gap-3 md:flex-row">
              <input
                value={solveInput}
                onChange={(e) => setSolveInput(e.target.value)}
                placeholder="اكتب الحل"
                className="w-full max-w-sm rounded-2xl border border-white/20 bg-white px-4 py-3 text-center text-lg font-bold text-black outline-none"
              />

              <button onClick={solveWord} className="btn-primary min-w-[140px]">
                حل الكلمة
              </button>
            </div>
          </div>
        )}

        {phase === "celebrate" && (
          <div className="mt-8">
            <div className="animate-bounce rounded-3xl border border-yellow-300/40 bg-yellow-400/15 px-6 py-8 shadow-2xl">
              <p className="text-5xl">🏆</p>
              <p className="mt-4 text-3xl font-black">{winnerName}</p>
              <p className="mt-2 text-lg text-white/85">فاز بالجولة!</p>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
