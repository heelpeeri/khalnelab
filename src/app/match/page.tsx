'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

type GameType = "draw" | "categories";

function ProverbGame({
  onRoundEnd,
}: {
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

  useEffect(() => {
    if (revealed) return;

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, revealed]);

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
          <button
            type="button"
            onClick={() => setTeam1Ready(true)}
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
          <button
            type="button"
            onClick={() => setTeam2Ready(true)}
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
  const [selectedGame, setSelectedGame] = useState<GameType>("draw");

  const [started, setStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");

    if (game === "draw" || game === "categories") {
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
    selectedGame === "draw" ? (
      <ProverbGame onRoundEnd={endRound} />
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
