'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";
import { WordGame } from "@/components/match/WordGame";
import { ProverbGame } from "@/components/match/ProverbGame";
import { CategoriesGame } from "@/components/match/CategoriesGame";
import { ScrambleGame } from "@/components/match/ScrambleGame";

type GameType = "word" | "draw" | "categories" | "scramble";
type PlayMode = "solo" | "teams";
type WinnerType = "side1" | "side2" | "none";

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
    if (game === "word" || game === "draw" || game === "categories" || game === "scramble") {
      setSelectedGame(game);
    }
  }, []);

  const side1Label = mode === "teams" ? "اسم فريق 1" : "اسم اللاعب 1";
  const side2Label = mode === "teams" ? "اسم فريق 2" : "اسم اللاعب 2";
 const currentTurnLabel =
  selectedGame === "scramble"
    ? "نمط الجولة"
    : mode === "teams"
    ? "دور الفريق"
    : "دور اللاعب";
  const winnerQuestionLabel =
    mode === "teams" ? "اختر الجهة الفائزة في هذه الجولة" : "اختر الفائز في هذه الجولة";

  function getGameTitle(game: GameType) {
    if (game === "word") return "وشي الكلمة؟";
    if (game === "draw") return "خمن المثل من الإيموجي";
    if (game === "scramble") return "حروف بالخلاط";
    return "إنسان حيوان نبات جماد";
  }

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

  const currentTurnName =
  selectedGame === "scramble"
    ? "تنافس مباشر"
    : currentRound % 2 === 1
    ? side1
    : side2;

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
                  <option value="scramble">حروف بالخلاط</option>
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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              {roundReady ? (
                <GlassCard className="min-h-[780px] p-8 text-center">
                  <div className="flex h-full min-h-[700px] flex-col items-center justify-center">
                    <p className="text-sm text-white/70">الجولة القادمة</p>
                    <h2 className="mt-2 text-4xl font-black">
                      الجولة {currentRound}
                    </h2>
                    <p className="mt-4 text-xl text-white/80">
                      اللعبة: {getGameTitle(selectedGame)}
                    </p>
                    <p className="mt-2 text-lg text-white/70">
                      الدور على: {currentTurnName}
                    </p>

                    <button
                      type="button"
                      onClick={beginRound}
                      className="btn-primary mt-8"
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
