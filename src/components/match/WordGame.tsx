'use client';

import { useEffect, useState } from "react";
import GameLayout from "@/components/match/GameLayout";

type WinnerType = "side1" | "side2" | "none";
type CellState = "correct" | "present" | "absent";

export default function WordGame({
  onRoundEnd,
  roundKey,
  side1Name = "فريق 1",
  side2Name = "فريق 2",
  side1Score = 0,
  side2Score = 0,
  currentRound = 1,
  totalRounds = 3,
}: {
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  side1Name?: string;
  side2Name?: string;
  side1Score?: number;
  side2Score?: number;
  currentRound?: number;
  totalRounds?: number;
}) {
  const WORDS_4 = [
    "كتاب",
    "مكتب",
    "هاتف",
    "تفاح",
    "قطار",
    "كرسي",
    "شمعة",
    "خيمة",
  ];

  const MAX_TRIES = 6;

  function getRandomWord() {
    return WORDS_4[Math.floor(Math.random() * WORDS_4.length)];
  }

  const [answer, setAnswer] = useState(getRandomWord);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [keyStatus, setKeyStatus] = useState<Record<string, CellState>>({});
  const [activeSide, setActiveSide] = useState<"side1" | "side2">("side1");

  const keyboardRows = [
    "ةجحخهعغفقثصض",
    "كمنتالبيسش",
    "ورزدذطظ",
  ];

  useEffect(() => {
    resetRound();
  }, [roundKey]);

  function resetRound() {
    setAnswer(getRandomWord());
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
    setKeyStatus({});
    setActiveSide("side1");
  }

  function normalize(text: string) {
    return text
      .trim()
      .replace(/\s+/g, "")
      .replace(/ة/g, "ه")
      .replace(/أ|إ|آ/g, "ا")
      .replace(/ى/g, "ي");
  }

  function submitGuess() {
    if (status !== "playing") return;

    const rawGuess = current.trim().replace(/\s+/g, "");
    const guess = normalize(rawGuess);
    const ans = normalize(answer);

    if (rawGuess.length !== answer.length) return;
    if (guesses.length >= MAX_TRIES) return;

    const nextGuesses = [...guesses, rawGuess];
    const nextKeyStatus = { ...keyStatus };

    rawGuess.split("").forEach((letter, i) => {
      const normalizedLetter = normalize(letter);
      const normalizedAnswerLetter = normalize(answer[i]);

      if (normalizedLetter === normalizedAnswerLetter) {
        nextKeyStatus[normalizedLetter] = "correct";
      } else if (ans.includes(normalizedLetter)) {
        if (nextKeyStatus[normalizedLetter] !== "correct") {
          nextKeyStatus[normalizedLetter] = "present";
        }
      } else {
        nextKeyStatus[normalizedLetter] = "absent";
      }
    });

    setGuesses(nextGuesses);
    setKeyStatus(nextKeyStatus);
    setCurrent("");

    if (guess === ans) {
      setStatus("won");
      onRoundEnd(activeSide);
      return;
    }

    if (nextGuesses.length >= MAX_TRIES) {
      setStatus("lost");
      onRoundEnd("none");
      return;
    }

    setActiveSide((prev) => (prev === "side1" ? "side2" : "side1"));
  }

  function getCellColor(letter: string, index: number) {
    const normalizedLetter = normalize(letter);
    const normalizedAnswerLetter = normalize(answer[index]);
    const normalizedAnswer = normalize(answer);

    if (normalizedAnswerLetter === normalizedLetter) {
      return "bg-green-500 text-white";
    }

    if (normalizedAnswer.includes(normalizedLetter)) {
      return "bg-yellow-400 text-black";
    }

    return "bg-gray-700 text-white";
  }

  function getKeyColor(key: string) {
    const state = keyStatus[normalize(key)];
    if (state === "correct") return "bg-green-500 text-white";
    if (state === "present") return "bg-yellow-400 text-black";
    if (state === "absent") return "bg-gray-700 text-white";
    return "bg-white/10 text-white";
  }

  const currentTurnName = activeSide === "side1" ? side1Name : side2Name;

  return (
    <GameLayout
      title="خمن الكلمة 💬"
      side1={side1Name}
      side2={side2Name}
      side1Score={side1Score}
      side2Score={side2Score}
      turn={currentTurnName}
      currentRound={currentRound}
      totalRounds={totalRounds}
      badge={String(currentRound)}
      onEndRound={() => onRoundEnd()}
    >
      <div className="flex flex-col justify-between gap-4 min-h-[70vh] sm:min-h-[75vh]">
        <div className="space-y-2">
          {guesses.map((g, i) => (
            <div key={i} className="flex justify-center gap-2">
              {g.split("").map((l, j) => (
                <div
                  key={j}
                  className={`w-12 h-12 flex items-center justify-center text-xl font-black rounded-xl border border-white/10 ${getCellColor(
                    l,
                    j
                  )}`}
                >
                  {l}
                </div>
              ))}
            </div>
          ))}

          {Array.from({ length: MAX_TRIES - guesses.length }).map((_, rowIndex) => (
            <div key={`empty-${rowIndex}`} className="flex justify-center gap-2">
              {Array.from({ length: answer.length }).map((__, colIndex) => {
                const previewLetter = rowIndex === 0 ? current[colIndex] ?? "" : "";

                return (
                  <div
                    key={colIndex}
                    className={`w-12 h-12 flex items-center justify-center text-xl font-black rounded-xl border ${
                      rowIndex === 0
                        ? "border-[#6d6be9] bg-[#20193f] text-white"
                        : "border-white/10 bg-[#16142a] text-white"
                    }`}
                  >
                    {previewLetter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 space-y-2 bg-[#0b0d20]/90 backdrop-blur-md py-2">
          {keyboardRows.map((row, i) => (
            <div key={i} className="flex justify-center gap-1">
              {row.split("").map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() =>
                    setCurrent((prev) =>
                      prev.length < answer.length ? prev + k : prev
                    )
                  }
                  disabled={status !== "playing"}
                  className={`px-2 py-2 rounded-lg text-sm border border-white/10 disabled:opacity-50 ${getKeyColor(
                    k
                  )}`}
                >
                  {k}
                </button>
              ))}
            </div>
          ))}

          <div className="flex justify-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => setCurrent((prev) => prev.slice(0, -1))}
              disabled={status !== "playing" || current.length === 0}
              className="btn-secondary disabled:opacity-50"
            >
              حذف
            </button>

            <button
              type="button"
              onClick={submitGuess}
              disabled={status !== "playing"}
              className="btn-primary disabled:opacity-50"
            >
              إدخال
            </button>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
