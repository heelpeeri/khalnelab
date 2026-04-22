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

  const WORDS = ["كتاب","مكتب","هاتف","تفاح","قطار","كرسي","شمعة","خيمة"];
  const MAX_TRIES = 6;

  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [keyStatus, setKeyStatus] = useState<Record<string, CellState>>({});
  const [activeSide, setActiveSide] = useState<"side1" | "side2">("side1");
  const [feedback, setFeedback] = useState("ابدأ التخمين");

  const keyboardRows = [
    "ةجحخهعغفقثصض",
    "كمنتالبيسش",
    "ورزدذطظ",
  ];

  useEffect(() => {
    resetRound();
  }, [roundKey]);

  function resetRound() {
    setAnswer(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
    setKeyStatus({});
    setActiveSide("side1");
    setFeedback("ابدأ التخمين");
  }

  // 🔥 تطبيع عربي
  function normalize(text: string) {
    return text
      .replace(/ة/g, "ه")
      .replace(/أ|إ|آ/g, "ا")
      .replace(/ى/g, "ي");
  }

  function submitGuess() {
    if (status !== "playing") return;

    const guess = normalize(current);
    const ans = normalize(answer);

    if (guess.length !== ans.length) {
      setFeedback(`لازم ${ans.length} حروف`);
      return;
    }

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

    if (guess === ans) {
      setStatus("won");
      setFeedback("🔥 صح!");
      onRoundEnd(activeSide);
      return;
    }

    if (nextGuesses.length >= MAX_TRIES) {
      setStatus("lost");
      setFeedback(`❌ انتهت! الكلمة: ${answer}`);
      onRoundEnd("none");
      return;
    }

    setFeedback(`باقي ${MAX_TRIES - nextGuesses.length} محاولات`);

    // 🔥 تبديل الدور
    setActiveSide(prev => prev === "side1" ? "side2" : "side1");
  }

  function getCellColor(letter: string, index: number) {
    if (normalize(answer[index]) === normalize(letter))
      return "bg-green-500";

    if (normalize(answer).includes(normalize(letter)))
      return "bg-yellow-400 text-black";

    return "bg-[#2f3750]";
  }

  function getKeyColor(key: string) {
    const state = keyStatus[key];
    if (state === "correct") return "bg-green-500";
    if (state === "present") return "bg-yellow-400 text-black";
    if (state === "absent") return "bg-[#2f3750]";
    return "bg-white/10 hover:bg-white/20";
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
      <div className="flex flex-col h-[75vh] justify-between">

        {/* FEEDBACK */}
        <div className="text-center font-bold text-white/80 mb-2">
          {feedback}
        </div>

        {/* GRID */}
        <div className="space-y-2">
          {guesses.map((g, i) => (
            <div key={i} className="flex justify-center gap-2">
              {g.split("").map((l, j) => (
                <div key={j}
                  className={`w-14 h-14 flex items-center justify-center text-xl font-black rounded-xl ${getCellColor(l, j)}`}>
                  {l}
                </div>
              ))}
            </div>
          ))}

          {/* INPUT */}
          <div className="flex justify-center gap-2 mt-3">
            {Array.from({ length: answer.length }).map((_, i) => (
              <div key={i}
                className="w-14 h-14 flex items-center justify-center border border-white/20 rounded-xl text-xl">
                {current[i] || ""}
              </div>
            ))}
          </div>
        </div>

        {/* KEYBOARD */}
        <div className="mt-4 space-y-2">
          {keyboardRows.map((row, i) => (
            <div key={i} className="flex justify-center gap-1">
              {row.split("").map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    if (current.length < answer.length)
                      setCurrent(prev => prev + k);
                  }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-sm font-bold ${getKeyColor(k)}`}
                >
                  {k}
                </button>
              ))}
            </div>
          ))}

          {/* BUTTONS */}
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => setCurrent(prev => prev.slice(0, -1))}
              className="btn-secondary w-28"
            >
              حذف
            </button>

            <button
              onClick={submitGuess}
              className="btn-primary w-28"
            >
              إدخال
            </button>

            <button
              onClick={() => onRoundEnd()}
              className="btn-secondary w-28"
            >
              إنهاء
            </button>
          </div>
        </div>

      </div>
    </GameLayout>
  );
}
