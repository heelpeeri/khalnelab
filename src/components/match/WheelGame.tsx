'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type WinnerType = "side1" | "side2";
type TurnType = "side1" | "side2";
type SegmentValue = number | "bankrupt" | "lose";
type Phase = "spin" | "guess" | "celebrate";

type Segment = {
  label: string;
  value: SegmentValue;
  color: string;
};

const SEGMENTS: Segment[] = [
  { label: "100", value: 100, color: "#22c55e" },
  { label: "200", value: 200, color: "#3b82f6" },
  { label: "300", value: 300, color: "#a855f7" },
  { label: "إفلاس", value: "bankrupt", color: "#ef4444" },
  { label: "500", value: 500, color: "#f59e0b" },
  { label: "خسارة الدور", value: "lose", color: "#6b7280" },
];

const PUZZLES = [
  { category: "أكلة", answer: "شاورما" },
  { category: "مدينة", answer: "الرياض" },
  { category: "براند", answer: "ابل" },
  { category: "سيارة", answer: "تويوتا" },
  { category: "مشروب", answer: "قهوة" },
  { category: "لاعب", answer: "ميسي" },
  { category: "تطبيق", answer: "سناب" },
  { category: "مطعم", answer: "البيك" },
];

const KEYBOARD_ROWS = [
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

function formatSpinValue(value: SegmentValue | null) {
  if (value === null) return "لف العجلة";
  if (value === "bankrupt") return "💸 إفلاس";
  if (value === "lose") return "❌ خسارة الدور";
  return `+${value}`;
}

function buildBanner(
  turn: TurnType,
  side1Name: string,
  side2Name: string,
  phase: Phase,
  spinning: boolean,
  currentSpinValue: SegmentValue | null,
) {
  const currentName = turn === "side1" ? side1Name : side2Name;

  if (phase === "celebrate") return "🏆 انتهت الجولة!";
  if (spinning) return "🎡 العجلة تدور...";
  if (phase === "spin") return `🎯 الدور على: ${currentName} — لف العجلة`;
  if (typeof currentSpinValue === "number") {
    return `✍️ اختر حرفًا — وإذا جاوبت صح كمل لين تغلط`;
  }
  return `🎯 الدور على: ${currentName}`;
}

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
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [phase, setPhase] = useState<Phase>("spin");

  const [turn, setTurn] = useState<TurnType>("side1");

  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);

  const [side1Score, setSide1Score] = useState(0);
  const [side2Score, setSide2Score] = useState(0);

  const [solveInput, setSolveInput] = useState("");
  const [winnerName, setWinnerName] = useState("");

  const [currentSpinValue, setCurrentSpinValue] = useState<SegmentValue | null>(null);
  const [lastLandedIndex, setLastLandedIndex] = useState<number | null>(null);

  const normalizedAnswer = useMemo(() => normalizeArabic(answer), [answer]);
  const currentName = turn === "side1" ? side1Name : side2Name;
  const segmentAngle = 360 / SEGMENTS.length;

  useEffect(() => {
    const i = Math.floor(Math.random() * PUZZLES.length);
    const puzzle = PUZZLES[i];

    setAnswer(puzzle.answer);
    setCategory(puzzle.category);
    setRevealed(Array(puzzle.answer.length).fill(""));
    setUsedLetters([]);
    setTurn("side1");
    setSolveInput("");
    setWinnerName("");
    setCurrentSpinValue(null);
    setLastLandedIndex(null);
    setSpinning(false);
    setPhase("spin");
    setRotation(0);
  }, [roundKey]);

  function nextTurn() {
    setTurn((prev) => (prev === "side1" ? "side2" : "side1"));
  }

  function isPuzzleSolved(nextRevealed: string[]) {
    return nextRevealed.every((letter) => letter !== "");
  }

  function finishRound(winner: WinnerType) {
    const name = winner === "side1" ? side1Name : side2Name;
    setWinnerName(name);
    setPhase("celebrate");

    window.setTimeout(() => {
      onRoundEnd(winner);
    }, 1400);
  }

  function spinWheel() {
    if (spinning || phase !== "spin") return;

    setSpinning(true);
    setCurrentSpinValue(null);
    setLastLandedIndex(null);

    const targetIndex = Math.floor(Math.random() * SEGMENTS.length);

    // نخلي مركز القطاع المختار يوقف تحت المؤشر العلوي بالضبط
    const targetCenterAngle = targetIndex * segmentAngle + segmentAngle / 2;
    const extraTurns = 5 + Math.floor(Math.random() * 3);
    const newRotation = rotation + extraTurns * 360 + (360 - targetCenterAngle);

    setRotation(newRotation);

    window.setTimeout(() => {
      const landedSegment = SEGMENTS[targetIndex];
      const landedValue = landedSegment.value;

      setLastLandedIndex(targetIndex);
      setCurrentSpinValue(landedValue);
      setSpinning(false);

      if (landedValue === "bankrupt") {
        if (turn === "side1") {
          setSide1Score(0);
        } else {
          setSide2Score(0);
        }

        setCurrentSpinValue(null);
        setLastLandedIndex(null);
        nextTurn();
        setPhase("spin");
        return;
      }

      if (landedValue === "lose") {
        setCurrentSpinValue(null);
        setLastLandedIndex(null);
        nextTurn();
        setPhase("spin");
        return;
      }

      setPhase("guess");
    }, 2200);
  }

  function pickLetter(letter: string) {
    if (spinning || phase !== "guess") return;
    if (typeof currentSpinValue !== "number") return;
    if (usedLetters.includes(letter)) return;

    setUsedLetters((prev) => [...prev, letter]);

    let count = 0;
    const updated = [...revealed];

    answer.split("").forEach((char, i) => {
      if (normalizeArabic(char) === normalizeArabic(letter)) {
        updated[i] = char;
        count += 1;
      }
    });

    setRevealed(updated);

    if (count > 0) {
      const gained = count * currentSpinValue;

      if (turn === "side1") {
        setSide1Score((s) => s + gained);
      } else {
        setSide2Score((s) => s + gained);
      }

      if (isPuzzleSolved(updated)) {
        finishRound(turn);
        return;
      }

      // مهم جدًا: إذا صح، يبقى في نفس الدور ونفس قيمة اللفة
      return;
    }

    // إذا غلط فقط هنا ينتهي الدور
    setCurrentSpinValue(null);
    setLastLandedIndex(null);
    nextTurn();
    setPhase("spin");
  }

  function solveWord() {
    if (phase === "celebrate") return;

    const guess = normalizeArabic(solveInput);
    if (!guess) return;

    if (guess === normalizedAnswer) {
      finishRound(turn);
      return;
    }

    setSolveInput("");
    setCurrentSpinValue(null);
    setLastLandedIndex(null);
    nextTurn();
    setPhase("spin");
  }

  return (
    <GlassCard className="min-h-[820px] p-6 text-center md:p-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-black">🎡 لف وخمّن</h2>
        <p className="mt-2 text-white/75">الفئة: {category}</p>

        <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-lg font-bold">
          {buildBanner(turn, side1Name, side2Name, phase, spinning, currentSpinValue)}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-right">
            <p className="text-sm text-white/60">{side1Name}</p>
            <p className="mt-2 text-4xl font-black text-white">{side1Score}</p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-right">
            <p className="text-sm text-white/60">{side2Name}</p>
            <p className="mt-2 text-4xl font-black text-white">{side2Score}</p>
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

        {phase === "celebrate" && (
          <div className="mt-8">
            <div className="animate-bounce rounded-3xl border border-yellow-300/40 bg-yellow-400/15 px-6 py-8 shadow-2xl">
              <p className="text-5xl">🏆</p>
              <p className="mt-4 text-3xl font-black">{winnerName}</p>
              <p className="mt-2 text-lg text-white/85">فاز بالجولة!</p>
            </div>
          </div>
        )}

        {phase === "spin" && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-base font-bold">
              الدور الحالي: {currentName}
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
                  transition: spinning
                    ? "transform 2.2s cubic-bezier(0.2, 0.9, 0.2, 1)"
                    : "none",
                }}
              >
                {SEGMENTS.map((segment, i) => {
                  const angle = i * segmentAngle + segmentAngle / 2;
                  const isActive = lastLandedIndex === i;

                  return (
                    <div
                      key={segment.label + i}
                      className="absolute left-1/2 top-1/2 origin-center"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-105px) rotate(${-angle}deg)`,
                      }}
                    >
                      <div
                        className={`w-20 text-center text-xs font-black leading-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] ${
                          isActive ? "scale-110" : ""
                        }`}
                      >
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
              disabled={spinning}
              className="btn-primary min-w-[160px] disabled:opacity-50"
            >
              {spinning ? "العجلة تدور..." : "لف العجلة"}
            </button>
          </div>
        )}

        {phase === "guess" && (
          <>
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-lg font-bold">
              النتيجة: {formatSpinValue(currentSpinValue)} — اختر حرفًا، وإذا كان صح كمل
            </div>

            <div className="mt-6 space-y-2">
              {KEYBOARD_ROWS.map((row, rowIndex) => (
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

              <button
                onClick={solveWord}
                className="btn-primary min-w-[140px]"
              >
                حل الكلمة
              </button>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
