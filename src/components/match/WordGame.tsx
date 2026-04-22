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

  const WORDS_4 = ["كتاب","مكتب","هاتف","تفاح","قطار","كرسي","شمعة","خيمة"];

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

  // 🔥 التطبيع (ه = ة)
  function normalize(text: string) {
    return text
      .replace(/ة/g, "ه")
      .replace(/أ|إ|آ/g, "ا")
      .replace(/ى/g, "ي");
  }

  function submitGuess() {
    const guess = normalize(current);
    const ans = normalize(answer);

    if (guess.length !== ans.length) return;

    const nextGuesses = [...guesses, current];
    const nextKeyStatus = { ...keyStatus };

    current.split("").forEach((letter, i) => {
      const l = normalize(letter);
      const a = normalize(answer[i]);

      if (l === a) nextKeyStatus[letter] = "correct";
      else if (ans.includes(l)) nextKeyStatus[letter] = "present";
      else nextKeyStatus[letter] = "absent";
    });

    setGuesses(nextGuesses);
    setKeyStatus(nextKeyStatus);
    setCurrent("");

    // ✅ فاز
    if (guess === ans) {
      setStatus("won");
      onRoundEnd(activeSide);
      return;
    }

    // ❌ انتهت المحاولات
    if (nextGuesses.length >= MAX_TRIES) {
      setStatus("lost");
      onRoundEnd("none");
      return;
    }

    // 🔥 تبديل الدور
    setActiveSide(prev => prev === "side1" ? "side2" : "side1");
  }

  function getCellColor(letter: string, index: number) {
    if (normalize(answer[index]) === normalize(letter))
      return "bg-green-500";

    if (normalize(answer).includes(normalize(letter)))
      return "bg-yellow-400 text-black";

    return "bg-gray-700";
  }

  function getKeyColor(key: string) {
    const state = keyStatus[key];
    if (state === "correct") return "bg-green-500";
    if (state === "present") return "bg-yellow-400 text-black";
    if (state === "absent") return "bg-gray-700";
    return "bg-white/10";
  }

  return (
    <GameLayout
      title={`خمن الكلمة (${currentRound}/${totalRounds})`}
      side1={side1Name}
      side2={side2Name}
      side1Score={side1Score}
      side2Score={side2Score}
      turn={activeSide === "side1" ? side1Name : side2Name}
      onEndRound={() => onRoundEnd()}
    >
      <div className="flex flex-col h-[80vh] justify-between">

        {/* GRID */}
        <div className="space-y-2">
          {guesses.map((g, i) => (
            <div key={i} className="flex justify-center gap-2">
              {g.split("").map((l, j) => (
                <div key={j} className={`w-12 h-12 flex items-center justify-center text-xl font-black rounded ${getCellColor(l, j)}`}>
                  {l}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* INPUT PREVIEW */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: answer.length }).map((_, i) => (
            <div key={i} className="w-12 h-12 flex items-center justify-center border rounded">
              {current[i] || ""}
            </div>
          ))}
        </div>

        {/* KEYBOARD (بدون سكرول 🔥) */}
        <div className="space-y-2">
          {keyboardRows.map((row, i) => (
            <div key={i} className="flex justify-center gap-1">
              {row.split("").map((k) => (
                <button
                  key={k}
                  onClick={() => setCurrent(prev => prev.length < answer.length ? prev + k : prev)}
                  className={`px-2 py-2 rounded text-sm ${getKeyColor(k)}`}
                >
                  {k}
                </button>
              ))}
            </div>
          ))}

          <div className="flex justify-center gap-2 mt-2">
            <button onClick={() => setCurrent(prev => prev.slice(0, -1))} className="btn-secondary">حذف</button>
            <button onClick={submitGuess} className="btn-primary">إدخال</button>
          </div>
        </div>

      </div>
    </GameLayout>
  );
}
