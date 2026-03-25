'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

type GameType = "word" | "draw" | "categories";

function WordGame({
  onRoundEnd,
}: {
  onRoundEnd: () => void;
}) {
  const WORDS_3 = [
    "بيت", "باب", "بحر", "جمل", "جبل", "حبر", "حلم", "حوت",
    "خيل", "درب", "رمل", "ريح", "زهر", "سهم", "سور", "شمس",
    "صقر", "طير", "عين", "قمر", "قلم", "كلب", "ليل", "مطر",
    "نار", "نجم", "نور", "نهر", "ورد", "وقت"
  ];

  const WORDS_4 = [
    "كتاب", "مكتب", "هاتف", "تفاح", "قطار", "كرسي", "شمعة", "خيمة",
    "سحاب", "غروب", "نجمة", "مكيف", "قهوة", "طريق", "ملعب", "موزة",
    "صحن", "سرير", "شباك", "حليب", "ورقة", "نخله", "ورده", "سمكه",
    "بيضه", "علبه", "شاحن", "لوحه", "مخده", "منبه", "فرشه", "ساعه",
    "غرفه", "مطبخ", "شارع", "مدرس", "طالب"
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

  function normalize(text: string) {
    return text.trim().replace(/\s+/g, "");
  }

  function submitGuess() {
    const guess = normalize(current);

    if (status !== "playing") return;
    if (guess.length !== answer.length) return;
    if (guesses.length >= MAX_TRIES) return;

    const nextGuesses = [...guesses, guess];
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

  function getCellColor(letter: string, index: number, guess: string) {
    if (answer[index] === letter) return "bg-green-500 border-green-500";
    if (answer.includes(letter)) return "bg-yellow-400 border-yellow-400";
    return "bg-gray-400 border-gray-400";
  }

  function resetWordGame() {
    setAnswer(getRandomWord());
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
  }

  const emptyRows = MAX_TRIES - guesses.length;

  return (
    <GlassCard className="p-6 text-center">
      <h2 className="text-2xl font-black">وشي الكلمة؟</h2>
      <p className="mt-2 text-white/80">
        خمن الكلمة من {answer.length} حروف
      </p>

      <div className="mt-6 space-y-2">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {guess.split("").map((letter, colIndex) => (
              <div
                key={colIndex}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg font-black text-white ${getCellColor(letter, colIndex, guess)}`}
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
  dir="rtl"
  inputMode="text"
  autoComplete="off"
  autoCorrect="off"
  spellCheck={false}
  maxLength={answer.length}
  value={current}
  onChange={(e) => {
    const value = e.target.value.replace(/\s/g, "");
    setCurrent(value);
  }}
  disabled={false}
  placeholder={`اكتب كلمة من ${answer.length} حروف`}
  className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-center text-2xl font-black text-white outline-none placeholder:text-white/60 disabled:opacity-50"
/>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={submitGuess}
            disabled={status !== "playing"}
            className="rounded-full bg-white px-6 py-3 font-bold text-red-500 disabled:opacity-50"
          >
            تأكيد
          </button>

          <button
            type="button"
            onClick={resetWordGame}
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold"
          >
            كلمة جديدة
          </button>

          <button
            type="button"
            onClick={onRoundEnd}
            disabled={status === "playing"}
            className="rounded-full bg-white px-6 py-3 font-bold text-red-500 disabled:opacity-50"
          >
            إنهاء الجولة
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
  team1,
  team2,
  onRoundEnd,
}: {
  team1: string;
  team2: string;
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

  const [team1Ready, setTeam1Ready] = useState(false);
  const [team2Ready, setTeam2Ready] = useState(false);
  const [team1Time, setTeam1Time] = useState<number | null>(null);
  const [team2Time, setTeam2Time] = useState<number | null>(null);

  useEffect(() => {
    if (revealed) return;

    if (team1Ready || team2Ready) {
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
  }, [timeLeft, revealed, team1Ready, team2Ready]);

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
    setTeam1Ready(false);
    setTeam2Ready(false);
    setTeam1Time(null);
    setTeam2Time(null);
  }

  return (
    <GlassCard className="p-6 text-center">
      <h2 className="text-2xl font-black">خمن المثل من الإيموجي</h2>

      <div className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-black text-red-500">
        الوقت: {timeLeft}
      </div>

      <div className="mt-8 text-6xl">{current.emoji}</div>

      {!revealed && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-white/80">
          ركز... الوقت يمشي ⏳
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{team1}</p>
          <p className="mt-2 text-sm text-white/80">
            {team1Ready ? "🔴 خلص" : "🔴 ينتظر"}
          </p>
          {team1Time !== null && (
            <p className="mt-1 text-xs text-white/70">خلص خلال {team1Time} ثانية</p>
          )}
          <button
            type="button"
            onClick={() => {
              setTeam1Ready(true);
              setTeam1Time(ROUND_TIME - timeLeft);
            }}
            disabled={team1Ready || revealed}
            className="mt-4 w-full rounded-2xl bg-white px-5 py-3 font-black text-red-500 disabled:opacity-50"
          >
            ✅ خلصنا
          </button>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{team2}</p>
          <p className="mt-2 text-sm text-white/80">
            {team2Ready ? "🔵 خلص" : "🔵 ينتظر"}
          </p>
          {team2Time !== null && (
            <p className="mt-1 text-xs text-white/70">خلص خلال {team2Time} ثانية</p>
          )}
          <button
            type="button"
            onClick={() => {
              setTeam2Ready(true);
              setTeam2Time(ROUND_TIME - timeLeft);
            }}
            disabled={team2Ready || revealed}
            className="mt-4 w-full rounded-2xl bg-white px-5 py-3 font-black text-red-500 disabled:opacity-50"
          >
            ✅ خلصنا
          </button>
        </div>
      </div>

      {revealed && (
        <>
          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
            <p className="text-lg font-black">⏰ انتهى الوقت!</p>
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
          className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold"
        >
          سؤال جديد
        </button>

        <button
          type="button"
          onClick={onRoundEnd}
          disabled={!revealed}
          className="rounded-full bg-white px-6 py-3 font-bold text-red-500 disabled:opacity-50"
        >
          إنهاء الجولة
        </button>
      </div>
    </GlassCard>
  );
}

function CategoriesGame({
  team1,
  team2,
  onRoundEnd,
}: {
  team1: string;
  team2: string;
  onRoundEnd: () => void;
}) {
  const fields = ["إنسان", "حيوان", "نبات", "جماد", "بلاد"];
  const ROUND_TIME = 40;
  const letters = ["م", "س", "ب", "ر", "ن", "ل", "ك"];
  const [letter, setLetter] = useState(() => letters[Math.floor(Math.random() * letters.length)]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [revealed, setRevealed] = useState(false);

  const [team1Ready, setTeam1Ready] = useState(false);
  const [team2Ready, setTeam2Ready] = useState(false);
  const [team1Time, setTeam1Time] = useState<number | null>(null);
  const [team2Time, setTeam2Time] = useState<number | null>(null);

  useEffect(() => {
    if (revealed) return;

    if (team1Ready && team2Ready) {
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
  }, [timeLeft, revealed, team1Ready, team2Ready]);

  function nextLetter() {
    const next = letters[Math.floor(Math.random() * letters.length)];
    setLetter(next);
    setTimeLeft(ROUND_TIME);
    setRevealed(false);
    setTeam1Ready(false);
    setTeam2Ready(false);
    setTeam1Time(null);
    setTeam2Time(null);
  }

  return (
    <GlassCard className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black">إنسان حيوان نبات جماد بلاد</h2>
        <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-red-500">
          الحرف: {letter}
        </div>
      </div>

      <div className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-black text-red-500">
        الوقت: {timeLeft}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <label key={field} className="rounded-3xl border border-white/20 bg-white/10 p-4">
            <div className="mb-3 text-sm font-black text-white/90">{field}</div>
            <input
              disabled={revealed}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/60 disabled:opacity-50"
              placeholder={`اكتب ${field}`}
            />
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{team1}</p>
          <p className="mt-2 text-sm text-white/80">
            {team1Ready ? "🔴 جاهز" : "🔴 لم ينتهِ"}
          </p>
          {team1Time !== null && (
            <p className="mt-1 text-xs text-white/70">خلص خلال {team1Time} ثانية</p>
          )}
          <button
            type="button"
            onClick={() => {
              setTeam1Ready(true);
              setTeam1Time(ROUND_TIME - timeLeft);
            }}
            disabled={team1Ready || revealed}
            className="mt-4 w-full rounded-2xl bg-white px-5 py-3 font-black text-red-500 disabled:opacity-50"
          >
            ✅ خلصنا
          </button>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{team2}</p>
          <p className="mt-2 text-sm text-white/80">
            {team2Ready ? "🔵 جاهز" : "🔵 لم ينتهِ"}
          </p>
          {team2Time !== null && (
            <p className="mt-1 text-xs text-white/70">خلص خلال {team2Time} ثانية</p>
          )}
          <button
            type="button"
            onClick={() => {
              setTeam2Ready(true);
              setTeam2Time(ROUND_TIME - timeLeft);
            }}
            disabled={team2Ready || revealed}
            className="mt-4 w-full rounded-2xl bg-white px-5 py-3 font-black text-red-500 disabled:opacity-50"
          >
            ✅ خلصنا
          </button>
        </div>
      </div>

      {revealed && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">🚫 انتهى الوقت – وقت الإعلان</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={nextLetter}
          className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold"
        >
          حرف جديد
        </button>

        <button
          type="button"
          onClick={onRoundEnd}
          disabled={!revealed}
          className="rounded-full bg-white px-6 py-3 font-bold text-red-500 disabled:opacity-50"
        >
          إنهاء الجولة
        </button>
      </div>
    </GlassCard>
  );
}

export default function MatchPage() {
  const [team1, setTeam1] = useState("فريق 1");
  const [team2, setTeam2] = useState("فريق 2");
  const [rounds, setRounds] = useState(3);
  const [selectedGame, setSelectedGame] = useState<GameType>("word");

  const [started, setStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");

    if (game === "word" || game === "draw" || game === "categories") {
      setSelectedGame(game);
    }
  }, []);

  function startGame() {
    if (!team1.trim() || !team2.trim()) return;
    setStarted(true);
    setCurrentRound(1);
    setTeam1Score(0);
    setTeam2Score(0);
    setGameEnded(false);
  }

  function endRound() {
    setShowWinnerModal(true);
  }

  function chooseWinner(winner: "team1" | "team2" | "none") {
    if (winner === "team1") setTeam1Score((s) => s + 1);
    if (winner === "team2") setTeam2Score((s) => s + 1);

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
    setTeam1Score(0);
    setTeam2Score(0);
    setShowWinnerModal(false);
    setGameEnded(false);
  }

  const currentTeam = currentRound % 2 === 1 ? team1 : team2;

  const currentGameBoard =
    selectedGame === "word" ? (
      <WordGame onRoundEnd={endRound} />
    ) : selectedGame === "draw" ? (
      <ProverbGame team1={team1} team2={team2} onRoundEnd={endRound} />
    ) : (
      <CategoriesGame team1={team1} team2={team2} onRoundEnd={endRound} />
    );

  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/70">وضع اللعب</p>
            <h1 className="text-3xl font-black">تحدي الفريقين</h1>
          </div>
          <Logo size={90} />
        </div>

        {!started && (
          <GlassCard className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">اسم فريق 1</label>
                <input
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 outline-none"
                  placeholder="مثال: الصقور"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">اسم فريق 2</label>
                <input
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 outline-none"
                  placeholder="مثال: الذئاب"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">اختيار اللعبة</label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value as GameType)}
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 outline-none"
                >
                  <option value="word">وشي الكلمة؟</option>
                  <option value="draw">خمن المثل من الإيموجي</option>
                  <option value="categories">إنسان حيوان نبات جماد</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">عدد الجولات</label>
                <select
                  value={rounds}
                  onChange={(e) => setRounds(Number(e.target.value))}
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 outline-none"
                >
                  <option value={1}>1</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                </select>
              </div>
            </div>

            <button
              onClick={startGame}
              className="mt-6 w-full rounded-2xl bg-white px-5 py-3 font-black text-red-500"
            >
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
                  <p className="text-sm text-white/70">دور الفريق</p>
                  <p className="mt-1 text-2xl font-black">{currentTeam}</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <span>{team1}</span>
                    <span className="font-black">{team1Score}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <span>{team2}</span>
                    <span className="font-black">{team2Score}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {gameEnded && (
          <GlassCard className="p-8 text-center">
            <h2 className="text-3xl font-black">انتهى التحدي</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-lg font-bold">{team1}</p>
                <p className="mt-2 text-4xl font-black">{team1Score}</p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-lg font-bold">{team2}</p>
                <p className="mt-2 text-4xl font-black">{team2Score}</p>
              </div>
            </div>

            <p className="mt-6 text-2xl font-black">
              {team1Score > team2Score
                ? `الفائز: ${team1}`
                : team2Score > team1Score
                ? `الفائز: ${team2}`
                : "تعادل"}
            </p>

            <button
              onClick={resetGame}
              className="mt-8 rounded-full bg-white px-6 py-3 font-black text-red-500"
            >
              إعادة اللعب
            </button>
          </GlassCard>
        )}
      </div>

      {showWinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-[32px] border border-white/20 bg-[#7a001f] p-6 text-center shadow-2xl">
            <h3 className="text-2xl font-black">مين فاز؟</h3>
            <p className="mt-2 text-white/75">اختر الفريق الفائز في هذه الجولة</p>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => chooseWinner("team1")}
                className="w-full rounded-2xl bg-white px-5 py-3 font-black text-red-500"
              >
                {team1}
              </button>

              <button
                onClick={() => chooseWinner("team2")}
                className="w-full rounded-2xl bg-white px-5 py-3 font-black text-red-500"
              >
                {team2}
              </button>

              <button
                onClick={() => chooseWinner("none")}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-black text-white"
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
