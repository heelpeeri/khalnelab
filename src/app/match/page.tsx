'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";
import WordGame from "@/components/match/WordGame";
import ProverbGame from "@/components/match/ProverbGame";
import CategoriesGame from "@/components/match/CategoriesGame";
import ScrambleGame from "@/components/match/ScrambleGame";
import WheelGame from "@/components/match/WheelGame";

type GameType = "word" | "draw" | "categories" | "scramble" | "wheel";
type PlayMode = "solo" | "teams";
type WinnerType = "side1" | "side2" | "none";

function MatchupBadge({
  side1,
  side2,
}: {
  side1: string;
  side2: string;
}) {
  return (
    <div className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-lg shadow-lg backdrop-blur-md">
      <span className="rounded-xl bg-pink-500/15 px-3 py-1 font-bold text-white">
        {side1}
      </span>

      <span className="text-sm font-medium text-white/65">ضد</span>

      <span className="rounded-xl bg-cyan-400/15 px-3 py-1 font-bold text-white">
        {side2}
      </span>
    </div>
  );
}

function StatusStrip({
  text,
  tone = "default",
}: {
  text: string;
  tone?: "default" | "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "border-green-300/20 bg-green-400/10 text-green-100"
      : tone === "warning"
      ? "border-yellow-300/20 bg-yellow-400/10 text-yellow-100"
      : "border-cyan-300/20 bg-cyan-400/10 text-white";

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-center text-lg font-black shadow-[0_0_18px_rgba(255,255,255,0.04)] ${toneClass}`}
    >
      {text}
    </div>
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
  const [roundReady, setRoundReady] = useState(true);
  const [roundSeed, setRoundSeed] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");
    if (
      game === "word" ||
      game === "draw" ||
      game === "categories" ||
      game === "scramble" ||
      game === "wheel"
    ) {
      setSelectedGame(game);
    }
  }, []);

  const side1Label = mode === "teams" ? "اسم فريق 1" : "اسم اللاعب 1";
  const side2Label = mode === "teams" ? "اسم فريق 2" : "اسم اللاعب 2";
  const currentTurnLabel = mode === "teams" ? "دور الفريق" : "دور اللاعب";
  const winnerQuestionLabel =
    mode === "teams" ? "اختر الجهة الفائزة في هذه الجولة" : "اختر الفائز في هذه الجولة";

  const currentTurnName = currentRound % 2 === 1 ? side1 : side2;

  const gameMeta = useMemo(() => {
    if (selectedGame === "word") {
      return {
        title: "خمن الكلمة",
        icon: "💬",
        hint: "خمن الكلمة حرف حرف، وكل محاولة تقربك أو تبعدك.",
      };
    }
    if (selectedGame === "draw") {
      return {
        title: "خمن المثل",
        icon: "✏️",
        hint: "خمن المثل من الإيموجي، والوقت يمشي.",
      };
    }
    if (selectedGame === "scramble") {
      return {
        title: "حروف بالخلاط",
        icon: "🧩",
        hint: "رتب الحروف بأسرع وقت، أول واحد يخلص يفوز.",
      };
    }
    if (selectedGame === "wheel") {
      return {
        title: "لف وخمن",
        icon: "🎡",
        hint: "لف، شوف الرقم، وبعدها اختر حرف أو حل الكلمة.",
      };
    }
    return {
      title: "إنسان حيوان نبات جماد بلاد",
      icon: "🌍",
      hint: "كل الإجابات لازم تبدأ بنفس الحرف، والسرعة تفرق.",
    };
  }, [selectedGame]);

  function startGame() {
    if (!side1.trim() || !side2.trim()) return;

    setStarted(true);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setGameEnded(false);
    setRoundReady(true);
    setRoundSeed(1);
  }

  function beginRound() {
    setRoundReady(false);
    setRoundSeed((s) => s + 1);
  }

  function endRound(winner?: WinnerType) {
    if (winner) {
      chooseWinner(winner);
      return;
    }
    setShowWinnerModal(true);
  }

  function chooseWinner(winner: WinnerType) {
    if (winner === "side1") setSide1Score((s) => s + 1);
    if (winner === "side2") setSide2Score((s) => s + 1);

    setShowWinnerModal(false);

    if (currentRound >= rounds) {
      setGameEnded(true);
      return;
    }

    setCurrentRound((r) => r + 1);
    setRoundReady(true);
  }

  function resetGame() {
    setStarted(false);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setShowWinnerModal(false);
    setGameEnded(false);
    setRoundReady(true);
    setRoundSeed(1);
  }

  const currentGameBoard =
    selectedGame === "word" ? (
      <WordGame onRoundEnd={endRound} roundKey={roundSeed} />
    ) : selectedGame === "draw" ? (
      <ProverbGame
        mode={mode}
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
      />
    ) : selectedGame === "scramble" ? (
      <ScrambleGame
        mode={mode}
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
      />
    ) : selectedGame === "wheel" ? (
      <WheelGame
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
      />
    ) : (
      <CategoriesGame
        mode={mode}
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
      />
    );

  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
              MATCH MODE
            </p>
            <h1 className="mt-1 text-3xl font-black">تحدي الجلسة</h1>
          </div>
          <Logo size={90} />
        </div>

        {!started && (
          <GlassCard className="p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
                  READY ROOM
                </p>
                <h2 className="mt-1 text-2xl font-black">جهّز التحدي</h2>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-right">
                <p className="text-xs text-white/55">اللعبة الحالية</p>
                <p className="mt-1 font-black">
                  {gameMeta.icon} {gameMeta.title}
                </p>
              </div>
            </div>

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
                  <option value="word">خمن الكلمة</option>
                  <option value="draw">خمن المثل</option>
                  <option value="categories">إنسان حيوان نبات جماد بلاد</option>
                  <option value="scramble">حروف بالخلاط</option>
                  <option value="wheel">لف وخمن</option>
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

            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-right">
              <p className="text-sm text-white/60">مختصر اللعبة</p>
              <p className="mt-1 text-white/90">{gameMeta.hint}</p>
            </div>

            <button onClick={startGame} className="btn-primary mt-6 w-full">
              ابدأ اللعب
            </button>
          </GlassCard>
        )}

        {started && !gameEnded && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              {roundReady ? (
                <GlassCard className="min-h-[780px] p-8 text-center">
                  <div className="flex h-full min-h-[700px] flex-col items-center justify-center">
                    <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
                      NEXT ROUND
                    </p>

                    <h2 className="mt-3 text-5xl font-black">
                      الجولة {currentRound}
                    </h2>

                    <div className="mt-4 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-lg font-black">
                      {gameMeta.icon} {gameMeta.title}
                    </div>

                    <div className="mt-6">
                      <MatchupBadge side1={side1} side2={side2} />
                    </div>

                    <div className="mt-6 w-full max-w-xl">
                      <StatusStrip text={`${currentTurnLabel}: ${currentTurnName}`} />
                    </div>

                    <div className="mt-4 w-full max-w-xl rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm leading-7 text-white/80">
                      {gameMeta.hint}
                    </div>

                    <button
                      type="button"
                      onClick={beginRound}
                      className="btn-primary mt-8 min-w-[220px]"
                    >
                      ابدأ الجولة
                    </button>
                  </div>
                </GlassCard>
              ) : (
                currentGameBoard
              )}
            </div>

            <GlassCard className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-black">لوحة التحدي</h3>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black tracking-[0.18em] text-cyan-300/80">
                  LIVE
                </span>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-sm text-white/70">الجولة</p>
                  <p className="mt-1 text-3xl font-black text-yellow-200">
                    {currentRound} / {rounds}
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 p-4">
                  <p className="text-sm text-white/70">{currentTurnLabel}</p>
                  <p className="mt-1 text-2xl font-black">{currentTurnName}</p>
                </div>

                <div
                  className={`rounded-2xl border p-4 ${
                    currentTurnName === side1
                      ? "border-pink-300/30 bg-pink-500/15 shadow-[0_0_18px_rgba(236,72,153,0.14)]"
                      : "border-white/10 bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{side1}</span>
                    <span className="text-2xl font-black text-yellow-200">
                      {side1Score}
                    </span>
                  </div>
                </div>

                <div
                  className={`rounded-2xl border p-4 ${
                    currentTurnName === side2
                      ? "border-cyan-300/30 bg-cyan-400/15 shadow-[0_0_18px_rgba(34,211,238,0.14)]"
                      : "border-white/10 bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{side2}</span>
                    <span className="text-2xl font-black text-yellow-200">
                      {side2Score}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {gameEnded && (
          <GlassCard className="p-8 text-center">
            <p className="text-sm font-black tracking-[0.18em] text-yellow-200/85">
              GAME OVER
            </p>

            <h2 className="mt-2 text-4xl font-black">🏆 انتهى التحدي</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-pink-300/20 bg-pink-500/10 p-5">
                <p className="text-lg font-bold">{side1}</p>
                <p className="mt-2 text-4xl font-black text-yellow-200">
                  {side1Score}
                </p>
              </div>

              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5">
                <p className="text-lg font-bold">{side2}</p>
                <p className="mt-2 text-4xl font-black text-yellow-200">
                  {side2Score}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <StatusStrip
                text={
                  side1Score > side2Score
                    ? `الفائز: ${side1}`
                    : side2Score > side1Score
                    ? `الفائز: ${side2}`
                    : "تعادل"
                }
                tone={side1Score === side2Score ? "warning" : "success"}
              />
            </div>

            <button onClick={resetGame} className="btn-primary mt-8 min-w-[220px]">
              إعادة اللعب
            </button>
          </GlassCard>
        )}
      </div>

      {showWinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] border border-white/20 bg-[#7a001f] p-6 text-center shadow-2xl">
            <p className="text-sm font-black tracking-[0.18em] text-yellow-200/85">
              ROUND RESULT
            </p>

            <h3 className="mt-2 text-3xl font-black">🏆 مين فاز؟</h3>
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
