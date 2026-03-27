'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

type GameType = "word" | "draw" | "categories";
type PlayMode = "solo" | "teams";

function WordGame({
  onRoundEnd,
}: {
  onRoundEnd: () => void;
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
  "ضصثقفغعهخحجد",
  "شسيبلاتنمكط",
  "ئءؤرلاىةوزظ",
];

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

  function resetWordGame() {
    setAnswer(getRandomWord());
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
    setKeyStatus({});
  }

  const emptyRows = MAX_TRIES - guesses.length;

  return (
    <GlassCard className="p-6 text-center">
      <h2 className="text-2xl font-black">وشي الكلمة؟</h2>
      <p className="mt-2 text-white/80">خمن الكلمة من {answer.length} حروف</p>

      <div className="mt-6 space-y-2">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {guess.split("").map((letter, colIndex) => (
              <div
                key={colIndex}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg font-black text-white ${getCellColor(letter, colIndex)}`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}

        {Array.from({ length: emptyRows }).map((_, rowIndex) => (
          <div key={`empty-${rowIndex}`} className="flex justify-center gap-2">
            {Array.from({ length: answer.length }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-lg font-black text-white"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <input
          type="text"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder={`اكتب كلمة من ${answer.length} حروف`}
          className="w-full max-w-sm rounded-2xl border border-white/20 bg-white px-4 py-3 text-center text-2xl font-black text-black outline-none"
        />

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={submitGuess}
            disabled={status !== "playing"}
            className="btn-primary disabled:opacity-50"
          >
            تأكيد
          </button>

          <button
            type="button"
            onClick={resetWordGame}
            className="btn-secondary"
          >
            كلمة جديدة
          </button>

          <button
            type="button"
            onClick={onRoundEnd}
            disabled={status === "playing"}
            className="btn-primary disabled:opacity-50"
          >
            إنهاء الجولة
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap justify-center gap-2">
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
                    if (current.length < answer.length && status === "playing") {
                      setCurrent((prev) => prev + key);
                    }
                  }}
                  className={`h-11 min-w-[42px] rounded-xl px-3 text-sm font-bold text-white transition active:scale-95 ${color}`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}

        <div className="mt-3 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrent((prev) => prev.slice(0, -1))}
            className="btn-secondary min-w-[100px]"
          >
            حذف ⌫
          </button>

          <button
            type="button"
            onClick={submitGuess}
            disabled={status !== "playing"}
            className="btn-primary min-w-[100px] disabled:opacity-50"
          >
            إدخال
          </button>
        </div>
      </div>

      {status === "won" && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4">
          <p className="text-lg font-black">🔥 ممتاز! عرفت الكلمة</p>
        </div>
      )}

      {status === "lost" && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4">
          <p className="text-lg font-black">انتهت المحاولات</p>
          <p className="mt-2 text-white/80">الكلمة الصحيحة: {answer}</p>
        </div>
      )}
    </GlassCard>
  );
}

function ProverbGame({
  mode,
  side1Name,
  side2Name,
  onRoundEnd,
}: {
  mode: PlayMode;
  side1Name: string;
  side2Name: string;
  onRoundEnd: () => void;
}) {
  const puzzles = [
    { emoji: "🐒👩🦌", answer: "القرد في عين امه غزال" },
    { emoji: "🪢🤥⏳", answer: "حبل الكذب قصير" },
    { emoji: "👊😭🏃🗣️", answer: "ضربني وبكى سبقني واشتكى" },
    { emoji: "🐦✋🔟🌳", answer: "طير باليد ولا عشره بالشجره" },
    { emoji: "🚪💨🔒😌", answer: "الباب اللي يجي منه ريح سده واستريح" },
    { emoji: "🦵📏🛏️", answer: "مد رجلك على قد لحافك" },
    { emoji: "👤🍯👅❌", answer: "اذا كان صاحبك عسل لا تلحسه كله" },
    { emoji: "🌴📏🐐🧠", answer: "الطول طول نخله والعقل عقل صخله" },
    { emoji: "👁️😒🪵", answer: "عين الحسود فيها عود" },
    { emoji: "🍇🙅‍♂️😖", answer: "اللي ما يطول العنب حامض عنه يقول" },
    { emoji: "🦅🤷‍♂️🔥🍗", answer: "اللي ما يعرف الصقر يشويه" },
    { emoji: "❤️👁️❌", answer: "الحب اعمى" },
    { emoji: "😴👑", answer: "النوم سلطان" },
    { emoji: "✋❌👏", answer: "يد وحده ما تصفق" },
    { emoji: "👅🐎", answer: "لسانك حصانك" },
    { emoji: "❓👨‍🔧✔️👨‍⚕️❌", answer: "اسال مجرب ولا تسال طبيب" },
    { emoji: "🔥➡️💨😡", answer: "لا تشب النار وتزعل من دخانها" },
  ];

  const ROUND_TIME = 20;
  const [index, setIndex] = useState(() => Math.floor(Math.random() * puzzles.length));
  const current = useMemo(() => puzzles[index], [index]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [revealed, setRevealed] = useState(false);

  const [side1Ready, setSide1Ready] = useState(false);
  const [side2Ready, setSide2Ready] = useState(false);
  const [side1Time, setSide1Time] = useState<number | null>(null);
  const [side2Time, setSide2Time] = useState<number | null>(null);

  const readyLabel = mode === "teams" ? "خلصنا" : "خلصت";

  const instructionText =
    mode === "teams"
      ? 'إذا انتهى الفريق، يقول لصاحب الجلسة: "خلصنا" ثم يسجلها صاحب الجلسة'
      : 'إذا انتهى اللاعب، يقول لصاحب الجلسة: "خلصت" ثم يسجلها صاحب الجلسة';

  useEffect(() => {
    if (revealed) return;

    if (side1Ready || side2Ready) {
      setRevealed(true);
      return;
    }

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, revealed, side1Ready, side2Ready]);

  function nextQuestion() {
    let nextIndex = Math.floor(Math.random() * puzzles.length);
    if (puzzles.length > 1) {
      while (nextIndex === index) {
        nextIndex = Math.floor(Math.random() * puzzles.length);
      }
    }

    setIndex(nextIndex);
    setTimeLeft(ROUND_TIME);
    setRevealed(false);
    setSide1Ready(false);
    setSide2Ready(false);
    setSide1Time(null);
    setSide2Time(null);
  }

  return (
    <GlassCard className="p-6 text-center">
      <h2 className="text-2xl font-black">خمن المثل من الإيموجي</h2>

      <div className="mt-4 rounded-3xl border border-white/20 bg-white/10 p-4 text-sm leading-7 text-white/80">
        {instructionText}
      </div>

      <div className="mt-4 w-full max-w-md mx-auto">
        <div className="mb-1 flex justify-between text-sm text-white/80">
          <span>الوقت</span>
          <span>{timeLeft}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-white transition-all duration-1000"
            style={{ width: `${(timeLeft / 20) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-8 text-6xl">{current.emoji}</div>

      {!revealed && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-white/80">
          ركز... الوقت يمشي ⏳
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{side1Name}</p>
          <p className="mt-2 text-sm text-white/80">
            {side1Ready ? "✅ تم التسجيل" : "⏳ لم يسجل بعد"}
          </p>
          {side1Time !== null && (
            <p className="mt-1 text-xs text-white/70">تم تسجيله خلال {side1Time} ثانية</p>
          )}
          <button
            type="button"
            onClick={() => {
              setSide1Ready(true);
              setSide1Time(ROUND_TIME - timeLeft);
            }}
            disabled={side1Ready || revealed}
            className="btn-primary mt-4 w-full disabled:opacity-50"
          >
            {readyLabel}
          </button>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{side2Name}</p>
          <p className="mt-2 text-sm text-white/80">
            {side2Ready ? "✅ تم التسجيل" : "⏳ لم يسجل بعد"}
          </p>
          {side2Time !== null && (
            <p className="mt-1 text-xs text-white/70">تم تسجيله خلال {side2Time} ثانية</p>
          )}
          <button
            type="button"
            onClick={() => {
              setSide2Ready(true);
              setSide2Time(ROUND_TIME - timeLeft);
            }}
            disabled={side2Ready || revealed}
            className="btn-primary mt-4 w-full disabled:opacity-50"
          >
            {readyLabel}
          </button>
        </div>
      </div>

      {revealed && (
        <>
          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
            <p className="text-lg font-black animate-pulse">⏰ انتهى الوقت!</p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm text-white/70">الإجابة الصحيحة</p>
            <p className="mt-2 text-2xl font-black">{current.answer}</p>
          </div>
        </>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={nextQuestion}
          className="btn-secondary"
        >
          سؤال جديد
        </button>

        <button
          type="button"
          onClick={onRoundEnd}
          disabled={!revealed}
          className="btn-primary disabled:opacity-50"
        >
          إنهاء الجولة
        </button>
      </div>
    </GlassCard>
  );
}

function CategoriesGame({
  mode,
  side1Name,
  side2Name,
  onRoundEnd,
}: {
  mode: PlayMode;
  side1Name: string;
  side2Name: string;
  onRoundEnd: () => void;
}) {
  const ROUND_TIME = 40;
  const letters = ["م", "س", "ب", "ر", "ن", "ل", "ك"];
  const [letter, setLetter] = useState(() => letters[Math.floor(Math.random() * letters.length)]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [revealed, setRevealed] = useState(false);

  const [side1Ready, setSide1Ready] = useState(false);
  const [side2Ready, setSide2Ready] = useState(false);
  const [side1Time, setSide1Time] = useState<number | null>(null);
  const [side2Time, setSide2Time] = useState<number | null>(null);

  const readyLabel = mode === "teams" ? "خلصنا" : "خلصت";

  const instructionText =
    mode === "teams"
      ? 'فكروا في: إنسان – حيوان – نبات – جماد – بلاد، كلها بنفس الحرف. إذا انتهى الفريق، يقول لصاحب الجلسة: "خلصنا" ثم يسجلها صاحب الجلسة'
      : 'فكر في: إنسان – حيوان – نبات – جماد – بلاد، كلها بنفس الحرف. إذا انتهى اللاعب، يقول لصاحب الجلسة: "خلصت" ثم يسجلها صاحب الجلسة';

  useEffect(() => {
    if (revealed) return;

    if (side1Ready && side2Ready) {
      setRevealed(true);
      return;
    }

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, revealed, side1Ready, side2Ready]);

  function nextLetter() {
    const next = letters[Math.floor(Math.random() * letters.length)];
    setLetter(next);
    setTimeLeft(ROUND_TIME);
    setRevealed(false);
    setSide1Ready(false);
    setSide2Ready(false);
    setSide1Time(null);
    setSide2Time(null);
  }

  return (
    <GlassCard className="p-6 text-center">
      <h2 className="text-2xl font-black">إنسان حيوان نبات جماد بلاد</h2>

      <div className="mt-6 flex justify-center">
        <div className="rounded-[30px] bg-white px-12 py-8 text-7xl font-black text-red-500 shadow-xl">
          {letter}
        </div>
      </div>

      <div className="mt-4 w-full max-w-md mx-auto">
        <div className="mb-1 flex justify-between text-sm text-white/80">
          <span>الوقت</span>
          <span>{timeLeft}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-white transition-all duration-1000"
            style={{ width: `${(timeLeft / 40) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-6 text-center">
        <p className="text-lg font-black">تعليمات الجولة</p>
        <p className="mt-3 leading-8 text-white/80">{instructionText}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{side1Name}</p>
          <p className="mt-2 text-sm text-white/80">
            {side1Ready ? "✅ تم التسجيل" : "⏳ لم يسجل بعد"}
          </p>
          {side1Time !== null && (
            <p className="mt-1 text-xs text-white/70">تم تسجيله خلال {side1Time} ثانية</p>
          )}
          <button
            type="button"
            onClick={() => {
              setSide1Ready(true);
              setSide1Time(ROUND_TIME - timeLeft);
            }}
            disabled={side1Ready || revealed}
            className="btn-primary mt-4 w-full disabled:opacity-50"
          >
            {readyLabel}
          </button>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{side2Name}</p>
          <p className="mt-2 text-sm text-white/80">
            {side2Ready ? "✅ تم التسجيل" : "⏳ لم يسجل بعد"}
          </p>
          {side2Time !== null && (
            <p className="mt-1 text-xs text-white/70">تم تسجيله خلال {side2Time} ثانية</p>
          )}
          <button
            type="button"
            onClick={() => {
              setSide2Ready(true);
              setSide2Time(ROUND_TIME - timeLeft);
            }}
            disabled={side2Ready || revealed}
            className="btn-primary mt-4 w-full disabled:opacity-50"
          >
            {readyLabel}
          </button>
        </div>
      </div>

      {revealed && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black animate-pulse">🚫 انتهى الوقت – وقت الإعلان</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={nextLetter}
          className="btn-secondary"
        >
          حرف جديد
        </button>

        <button
          type="button"
          onClick={onRoundEnd}
          disabled={!revealed}
          className="btn-primary disabled:opacity-50"
        >
          إنهاء الجولة
        </button>
      </div>
    </GlassCard>
  );
}

export default function MatchPage() {
  const [mode, setMode] = useState<PlayMode>("teams");
  const [side1, setSide1] = useState("فريق 1");
  const [side2, setSide2] = useState("فريق 2");
  const [rounds, setRounds] = useState(3);
  const [selectedGame, setSelectedGame] = useState<GameType>("word");

  const [started, setStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [side1Score, setSide1Score] = useState(0);
  const [side2Score, setSide2Score] = useState(0);

  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");
    if (game === "word" || game === "draw" || game === "categories") {
      setSelectedGame(game);
    }
  }, []);

  const side1Label = mode === "teams" ? "اسم فريق 1" : "اسم اللاعب 1";
  const side2Label = mode === "teams" ? "اسم فريق 2" : "اسم اللاعب 2";
  const currentTurnLabel = mode === "teams" ? "دور الفريق" : "دور اللاعب";
  const winnerQuestionLabel =
    mode === "teams" ? "اختر الجهة الفائزة في هذه الجولة" : "اختر الفائز في هذه الجولة";

  function startGame() {
    if (!side1.trim() || !side2.trim()) return;
    setStarted(true);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setGameEnded(false);
  }

  function endRound() {
    setShowWinnerModal(true);
  }

  function chooseWinner(winner: "side1" | "side2" | "none") {
    if (winner === "side1") setSide1Score((s) => s + 1);
    if (winner === "side2") setSide2Score((s) => s + 1);

    setShowWinnerModal(false);

    if (currentRound >= rounds) {
      setGameEnded(true);
      return;
    }

    setCurrentRound((r) => r + 1);
  }

  function resetGame() {
    setStarted(false);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setShowWinnerModal(false);
    setGameEnded(false);
  }

  const currentTurnName = currentRound % 2 === 1 ? side1 : side2;

  const currentGameBoard =
    selectedGame === "word" ? (
      <WordGame onRoundEnd={endRound} />
    ) : selectedGame === "draw" ? (
      <ProverbGame
        mode={mode}
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
      />
    ) : (
      <CategoriesGame
        mode={mode}
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
      />
    );

  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/70">وضع اللعب</p>
            <h1 className="text-3xl font-black">تحدي الجلسة</h1>
          </div>
          <Logo size={90} />
        </div>

        {!started && (
          <GlassCard className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">نوع التحدي</label>
                <select
                  value={mode}
                  onChange={(e) => {
                    const nextMode = e.target.value as PlayMode;
                    setMode(nextMode);
                    setSide1(nextMode === "teams" ? "فريق 1" : "لاعب 1");
                    setSide2(nextMode === "teams" ? "فريق 2" : "لاعب 2");
                  }}
                  className="input"
                >
                  <option value="teams">فريقين</option>
                  <option value="solo">فردي</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">اختيار اللعبة</label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value as GameType)}
                  className="input"
                >
                  <option value="word">وشي الكلمة؟</option>
                  <option value="draw">خمن المثل من الإيموجي</option>
                  <option value="categories">إنسان حيوان نبات جماد</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">{side1Label}</label>
                <input
                  value={side1}
                  onChange={(e) => setSide1(e.target.value)}
                  className="input"
                  placeholder={mode === "teams" ? "مثال: الصقور" : "مثال: محمد"}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">{side2Label}</label>
                <input
                  value={side2}
                  onChange={(e) => setSide2(e.target.value)}
                  className="input"
                  placeholder={mode === "teams" ? "مثال: الذئاب" : "مثال: خالد"}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-bold">عدد الجولات</label>
              <select
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="input"
              >
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
              </select>
            </div>

            <button onClick={startGame} className="btn-primary mt-6 w-full">
              ابدأ اللعب
            </button>
          </GlassCard>
        )}

        {started && !gameEnded && (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>{currentGameBoard}</div>

            <GlassCard className="p-6">
              <h3 className="text-xl font-black">لوحة التحدي</h3>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/70">الجولة</p>
                  <p className="mt-1 text-3xl font-black">
                    {currentRound} / {rounds}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/70">{currentTurnLabel}</p>
                  <p className="mt-1 text-2xl font-black">{currentTurnName}</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <span>{side1}</span>
                    <span className="font-black">{side1Score}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <span>{side2}</span>
                    <span className="font-black">{side2Score}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {gameEnded && (
          <GlassCard className="p-8 text-center">
            <h2 className="text-4xl font-black animate-bounce">🏆 انتهى التحدي</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-lg font-bold">{side1}</p>
                <p className="mt-2 text-4xl font-black">{side1Score}</p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-lg font-bold">{side2}</p>
                <p className="mt-2 text-4xl font-black">{side2Score}</p>
              </div>
            </div>

            <p className="mt-6 text-2xl font-black">
              {side1Score > side2Score
                ? `الفائز: ${side1}`
                : side2Score > side1Score
                ? `الفائز: ${side2}`
                : "تعادل"}
            </p>

            <button onClick={resetGame} className="btn-primary mt-8">
              إعادة اللعب
            </button>
          </GlassCard>
        )}
      </div>

      {showWinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-[32px] border border-white/20 bg-[#7a001f] p-6 text-center shadow-2xl">
            <h3 className="text-3xl font-black animate-bounce">🏆 مين فاز؟</h3>
            <p className="mt-2 text-white/75">{winnerQuestionLabel}</p>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => chooseWinner("side1")}
                className="btn-primary w-full"
              >
                {side1}
              </button>

              <button
                onClick={() => chooseWinner("side2")}
                className="btn-primary w-full"
              >
                {side2}
              </button>

              <button
                onClick={() => chooseWinner("none")}
                className="btn-secondary w-full"
              >
                لا أحد
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
