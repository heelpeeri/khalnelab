'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type WinnerType = "side1" | "side2" | "none";

type CellState = "correct" | "present" | "absent";

export default function WordGame({
  onRoundEnd,
  roundKey,
}: {
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
}) {
  const WORDS_3 = [
    "بيت", "باب", "بحر", "جمل", "جبل", "حبر", "حلم", "حوت",
    "خيل", "درب", "رمل", "ريح", "زهر", "سهم", "سور", "شمس",
    "صقر", "طير", "عين", "قمر", "قلم", "كلب", "ليل", "مطر",
    "نار", "نجم", "نور", "نهر", "ورد", "وقت",
  ];

  const WORDS_4 = [
    "كتاب", "مكتب", "هاتف", "تفاح", "قطار", "كرسي", "شمعة", "خيمة",
    "سحاب", "نجمة", "مكيف", "قهوة", "طريق", "ملعب", "موزة", "صحن",
    "سرير", "شباك", "حليب", "ورقة", "نخله", "ورده", "سمكه", "بيضه",
    "علبه", "شاحن", "لوحه", "مخده", "منبه", "فرشه", "ساعه", "غرفه",
    "مطبخ", "شارع", "مدرس", "طالب",
  ];

  function getRandomWord() {
    const useFour = Math.random() < 0.7;
    const list = useFour ? WORDS_4 : WORDS_3;
    return list[Math.floor(Math.random() * list.length)];
  }

  const MAX_TRIES = 6;

  const [answer, setAnswer] = useState(getRandomWord);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [keyStatus, setKeyStatus] = useState<Record<string, CellState>>({});
  const [feedback, setFeedback] = useState("اكتب الكلمة ثم اضغط إدخال");
  const [feedbackTone, setFeedbackTone] = useState<"default" | "success" | "warning">("default");
  const [shakeBoard, setShakeBoard] = useState(false);

  const keyboardRows = [
    "ةجحخهعغفقثصض",
    "كمنتالبيسش",
    "ورزدذطظ",
  ];

  useEffect(() => {
    setAnswer(getRandomWord());
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
    setKeyStatus({});
    setFeedback("اكتب الكلمة ثم اضغط إدخال");
    setFeedbackTone("default");
    setShakeBoard(false);
  }, [roundKey]);

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

    if (guesses.length >= MAX_TRIES) {
      return;
    }

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
    if (answer[index] === letter) return "bg-green-500 border-green-400";
    if (answer.includes(letter)) return "bg-yellow-400 border-yellow-300 text-black";
    return "bg-gray-500 border-gray-400";
  }

  function getKeyColor(key: string) {
    const state = keyStatus[key];
    if (state === "correct") return "bg-green-500 border-green-400";
    if (state === "present") return "bg-yellow-400 border-yellow-300 text-black";
    if (state === "absent") return "bg-gray-500 border-gray-400";
    return "bg-white/10 border-white/10 hover:bg-pink-500/25";
  }

  const emptyRows = MAX_TRIES - guesses.length;
  const triesUsed = guesses.length;
  const triesLeft = MAX_TRIES - triesUsed;

  return (
    <GlassCard className="panel-animated min-h-[780px] p-8 text-center">
      <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">WORD</p>
      <h2 className="mt-2 text-3xl font-black">خمن الكلمة</h2>
      <p className="mt-2 text-white/80">خمن الكلمة من {answer.length} حروف</p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-sm text-white/60">المحاولات</p>
          <p className="mt-1 text-3xl font-black text-yellow-200">
            {triesUsed} / {MAX_TRIES}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-sm text-white/60">المتبقي</p>
          <p className="mt-1 text-3xl font-black text-cyan-200">
            {triesLeft}
          </p>
        </div>
      </div>

      <div
        className={`mt-5 rounded-2xl border px-4 py-3 text-lg font-black ${
          feedbackTone === "success"
            ? "border-green-300/20 bg-green-400/10 text-green-100"
            : feedbackTone === "warning"
            ? "border-yellow-300/20 bg-yellow-400/10 text-yellow-100"
            : "border-cyan-300/20 bg-cyan-400/10 text-white"
        }`}
      >
        {feedback}
      </div>

      <div className={`mt-6 space-y-3 ${shakeBoard ? "animate-shake-soft" : ""}`}>
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="animate-fade-in-up flex justify-center gap-3">
            {guess.split("").map((letter, colIndex) => (
              <div
                key={colIndex}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-black text-white shadow-[0_0_12px_rgba(255,255,255,0.05)] ${getCellColor(letter, colIndex)}`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}

        {Array.from({ length: emptyRows }).map((_, rowIndex) => (
          <div key={`empty-${rowIndex}`} className="flex justify-center gap-3">
            {Array.from({ length: answer.length }).map((_, colIndex) => {
              const previewLetter = rowIndex === 0 ? current[colIndex] ?? "" : "";

              return (
                <div
                  key={colIndex}
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-black text-white ${
                    rowIndex === 0
                      ? "border-cyan-300/25 bg-cyan-400/10"
                      : "border-white/20 bg-white/5"
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
            className={`flex justify-center gap-2 ${
              rowIndex === 1 ? "mr-6" : rowIndex === 2 ? "mr-10" : ""
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
                className={`h-12 min-w-[48px] rounded-xl border px-3 text-base font-bold text-white transition active:scale-95 disabled:opacity-50 ${getKeyColor(
                  key
                )}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setCurrent((prev) => prev.slice(0, -1))}
            disabled={status !== "playing" || current.length === 0}
            className="btn-secondary min-w-[120px] disabled:opacity-50"
          >
            حذف ⌫
          </button>

          <button
            type="button"
            onClick={submitGuess}
            disabled={status !== "playing"}
            className="btn-primary min-w-[120px] disabled:opacity-50"
          >
            إدخال
          </button>

          <button
            type="button"
            onClick={() => onRoundEnd()}
            className="btn-secondary min-w-[140px]"
          >
            إنهاء الجولة
          </button>
        </div>
      </div>

      {status === "won" && (
        <div className="winner-animated mt-6 rounded-2xl border border-green-300/25 bg-green-400/10 p-4 shadow-[0_0_18px_rgba(34,197,94,0.12)]">
          <p className="text-lg font-black text-green-100">🔥 ممتاز! عرفت الكلمة</p>
        </div>
      )}

      {status === "lost" && (
        <div className="winner-animated mt-6 rounded-2xl border border-yellow-300/25 bg-yellow-400/10 p-4 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          <p className="text-lg font-black text-yellow-100">انتهت المحاولات</p>
          <p className="mt-2 text-white/85">الكلمة الصحيحة: {answer}</p>
        </div>
      )}
    </GlassCard>
  );
}
