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
  currentTurn = "الجميع",
  currentRound = 1,
  totalRounds = 3,
}: {
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  side1Name?: string;
  side2Name?: string;
  side1Score?: number;
  side2Score?: number;
  currentTurn?: string;
  currentRound?: number;
  totalRounds?: number;
}) {
  const WORDS_4 = [
    "كتاب", "مكتب", "هاتف", "تفاح", "قطار", "كرسي", "شمعة", "خيمة",
    "سحاب", "نجمة", "مكيف", "قهوة", "طريق", "ملعب", "موزة", "معلم",
    "سرير", "شباك", "حليب", "ورقة", "نخله", "ورده", "سمكه", "بيضه",
    "علبه", "لوحه", "مخده", "منبه", "فرشه", "ساعه", "غرفه", "مطبخ",
    "شارع", "مدرس", "طالب", "رمان", "خيار", "ارنب", "مقعد", "شروق",
    "عربي", "جوال", "فريق", "جهاز",
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
  const [feedback, setFeedback] = useState("ابدأ التخمين");
  const [feedbackTone, setFeedbackTone] = useState<"default" | "success" | "warning">("default");
  const [shakeBoard, setShakeBoard] = useState(false);

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
    setFeedback("ابدأ التخمين");
    setFeedbackTone("default");
    setShakeBoard(false);
  }

  function normalize(text: string) {
    return text.trim().replace(/\s+/g, "");
  }

  function pulseError(message: string) {
    setFeedback(message);
    setFeedbackTone("warning");
    setShakeBoard(true);
    setTimeout(() => setShakeBoard(false), 350);
  }

  function submitGuess() {
    const guess = normalize(current);

    if (status !== "playing") return;

    if (guess.length !== answer.length) {
      pulseError(`لازم تدخل كلمة من ${answer.length} حروف`);
      return;
    }

    if (guesses.length >= MAX_TRIES) return;

    const nextGuesses = [...guesses, guess];
    const nextKeyStatus = { ...keyStatus };

    guess.split("").forEach((letter, i) => {
      if (answer[i] === letter) {
        nextKeyStatus[letter] = "correct";
      } else if (answer.includes(letter)) {
        if (nextKeyStatus[letter] !== "correct") {
          nextKeyStatus[letter] = "present";
        }
      } else if (!nextKeyStatus[letter]) {
        nextKeyStatus[letter] = "absent";
      }
    });

    setKeyStatus(nextKeyStatus);
    setGuesses(nextGuesses);
    setCurrent("");

    if (guess === answer) {
      setStatus("won");
      setFeedback("ممتاز! جبتها صح");
      setFeedbackTone("success");
      return;
    }

    if (nextGuesses.length >= MAX_TRIES) {
      setStatus("lost");
      setFeedback("انتهت المحاولات");
      setFeedbackTone("warning");
      return;
    }

    setFeedback(`باقي ${MAX_TRIES - nextGuesses.length} محاولات`);
    setFeedbackTone("default");
  }

  function getCellColor(letter: string, index: number) {
    if (answer[index] === letter) return "bg-green-500 border-green-400 text-white";
    if (answer.includes(letter)) return "bg-yellow-400 border-yellow-300 text-black";
    return "bg-[#2f3750] border-[#4b5676] text-white";
  }

  function getKeyColor(key: string) {
    const state = keyStatus[key];
    if (state === "correct") return "bg-green-500 border-green-400 text-white";
    if (state === "present") return "bg-yellow-400 border-yellow-300 text-black";
    if (state === "absent") return "bg-[#2f3750] border-[#4b5676] text-white";
    return "bg-white/8 border-white/10 text-white hover:bg-white/14";
  }

  const emptyRows = MAX_TRIES - guesses.length;

  const statusClass =
    feedbackTone === "success"
      ? "border-green-300/20 bg-green-400/10 text-green-100"
      : feedbackTone === "warning"
      ? "border-yellow-300/20 bg-yellow-400/10 text-yellow-100"
      : "border-white/10 bg-white/6 text-white";

  return (
    <GameLayout
      title="خمن الكلمة 💬"
      side1={side1Name}
      side2={side2Name}
      side1Score={side1Score}
      side2Score={side2Score}
      turn={currentTurn}
      currentRound={currentRound}
      totalRounds={totalRounds}
      badge={String(currentRound)}
      onEndRound={() => onRoundEnd()}
    >
      <div className="mx-auto w-full max-w-2xl">
        <div className={`rounded-2xl border px-4 py-3 text-sm sm:text-base font-bold ${statusClass}`}>
          {feedback}
        </div>

        <div className={`mt-5 space-y-2 sm:space-y-3 ${shakeBoard ? "animate-shake-soft" : ""}`}>
          {guesses.map((guess, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2 sm:gap-3">
              {guess.split("").map((letter, colIndex) => (
                <div
                  key={colIndex}
                  className={`flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl border text-xl sm:text-2xl font-black shadow-[0_0_8px_rgba(255,255,255,0.03)] ${getCellColor(letter, colIndex)}`}
                >
                  {letter}
                </div>
              ))}
            </div>
          ))}

          {Array.from({ length: emptyRows }).map((_, rowIndex) => (
            <div key={`empty-${rowIndex}`} className="flex justify-center gap-2 sm:gap-3">
              {Array.from({ length: answer.length }).map((_, colIndex) => {
                const previewLetter = rowIndex === 0 ? current[colIndex] ?? "" : "";

                return (
                  <div
                    key={colIndex}
                    className={`flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl border text-xl sm:text-2xl font-black text-white ${
                      rowIndex === 0
                        ? "border-[#6d6be9] bg-[#20193f]"
                        : "border-white/10 bg-[#16142a]"
                    }`}
                  >
                    {previewLetter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          {keyboardRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`flex justify-center gap-1.5 sm:gap-2 ${
                rowIndex === 1 ? "mr-4 sm:mr-6" : rowIndex === 2 ? "mr-6 sm:mr-10" : ""
              }`}
            >
              {row.split("").map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (status !== "playing") return;
                    setCurrent((prev) => {
                      if (prev.length >= answer.length) return prev;
                      return prev + key;
                    });
                  }}
                  disabled={status !== "playing"}
                  className={`h-10 min-w-[38px] sm:h-12 sm:min-w-[48px] rounded-lg sm:rounded-xl border px-2 sm:px-3 text-sm sm:text-base font-bold transition active:scale-95 disabled:opacity-50 ${getKeyColor(
                    key
                  )}`}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setCurrent((prev) => prev.slice(0, -1))}
              disabled={status !== "playing" || current.length === 0}
              className="btn-secondary min-w-[100px] sm:min-w-[120px] disabled:opacity-50"
            >
              حذف
            </button>

            <button
              type="button"
              onClick={submitGuess}
              disabled={status !== "playing"}
              className="btn-primary min-w-[100px] sm:min-w-[120px] disabled:opacity-50"
            >
              إدخال
            </button>

            <button
              type="button"
              onClick={resetRound}
              className="btn-secondary min-w-[120px] sm:min-w-[140px]"
            >
              كلمة جديدة
            </button>
          </div>
        </div>

        {status === "won" && (
          <div className="mt-5 rounded-2xl border border-green-300/25 bg-green-400/10 p-4">
            <p className="text-base sm:text-lg font-black text-green-100">🔥 ممتاز! عرفت الكلمة</p>
          </div>
        )}

        {status === "lost" && (
          <div className="mt-5 rounded-2xl border border-yellow-300/25 bg-yellow-400/10 p-4">
            <p className="text-base sm:text-lg font-black text-yellow-100">انتهت المحاولات</p>
            <p className="mt-2 text-white/85">الكلمة الصحيحة: {answer}</p>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
