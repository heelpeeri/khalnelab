'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type WinnerType = "side1" | "side2" | "none";

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
  const [keyStatus, setKeyStatus] = useState<Record<string, "correct" | "present" | "absent">>({});

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
  }, [roundKey]);

  function normalize(text: string) {
    return text.trim().replace(/\s+/g, "");
  }

  function submitGuess() {
    const guess = normalize(current);

    if (status !== "playing") return;
    if (guess.length !== answer.length) return;
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
      return;
    }

    if (nextGuesses.length >= MAX_TRIES) {
      setStatus("lost");
    }
  }

  function getCellColor(letter: string, index: number) {
    if (answer[index] === letter) return "bg-green-500 border-green-500";
    if (answer.includes(letter)) return "bg-yellow-400 border-yellow-400";
    return "bg-gray-400 border-gray-400";
  }

  const emptyRows = MAX_TRIES - guesses.length;

  return (
    <GlassCard className="relative overflow-hidden border border-pink-400/25 bg-[#10001f]/75 p-8 text-center shadow-[0_0_28px_rgba(255,0,153,0.15)] backdrop-blur-md min-h-[780px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_35%)]" />
      <div className="relative z-10">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/75">WORD</p>
        <h2 className="mt-2 text-3xl font-black text-[#98ffb6] drop-shadow-[0_0_14px_rgba(152,255,182,0.35)]">
          خمن الكلمة
        </h2>
        <p className="mt-2 text-white/80">خمن الكلمة من {answer.length} حروف</p>

        <div className="mt-6 space-y-3">
          {guesses.map((guess, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-3">
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
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-2xl font-black text-white"
                  >
                    {previewLetter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => onRoundEnd()}
            className="btn-primary"
          >
            إنهاء الجولة
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {keyboardRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`flex justify-center gap-2 ${
                rowIndex === 1 ? "mr-6" : rowIndex === 2 ? "mr-10" : ""
              }`}
            >
              {row.split("").map((key) => {
                const keyColor = keyStatus[key];

                let color = "bg-white/10";
                if (keyColor === "correct") color = "bg-green-500";
                if (keyColor === "present") color = "bg-yellow-400";
                if (keyColor === "absent") color = "bg-gray-400";

                return (
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
                    className={`h-12 min-w-[48px] rounded-xl px-3 text-base font-bold text-white transition active:scale-95 hover:shadow-[0_0_14px_rgba(255,255,255,0.08)] ${color}`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ))}

          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrent((prev) => prev.slice(0, -1))}
              className="btn-secondary min-w-[120px]"
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
          </div>
        </div>

        {status === "won" && (
          <div className="mt-6 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-4 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
            <p className="text-lg font-black text-yellow-100">🔥 ممتاز! عرفت الكلمة</p>
          </div>
        )}

        {status === "lost" && (
          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4">
            <p className="text-lg font-black">انتهت المحاولات</p>
            <p className="mt-2 text-white/80">الكلمة الصحيحة: {answer}</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
