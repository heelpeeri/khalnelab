'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";
import WordGame from "@/components/match/WordGame";
import ProverbGame from "@/components/match/ProverbGame";
import CategoriesGame from "@/components/match/CategoriesGame";
import ScrambleGame from "@/components/match/ScrambleGame";

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

  const currentTurnName = currentRound % 2 === 1 ? side1 : side2;

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
    <main className="animate-fade-in-up min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-[1400px]">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">وضع اللعب</p>
            <h1 className="text-3xl font-black">تحدي الجلسة</h1>
          </div>
          <Logo size={80} />
        </div>

        {/* SETUP */}
        {!started && (
          <GlassCard className="panel-animated p-6">
            <div className="grid gap-4 md:grid-cols-2">

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as PlayMode)}
                className="input"
              >
                <option value="teams">فريقين</option>
                <option value="solo">فردي</option>
              </select>

              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value as GameType)}
                className="input"
              >
                <option value="word">خمن الكلمة</option>
                <option value="draw">خمن المثل</option>
                <option value="categories">إنسان حيوان نبات</option>
                <option value="scramble">حروف بالخلاط</option>
              </select>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                value={side1}
                onChange={(e) => setSide1(e.target.value)}
                className="input"
              />
              <input
                value={side2}
                onChange={(e) => setSide2(e.target.value)}
                className="input"
              />
            </div>

            <button onClick={startGame} className="btn-primary mt-6 w-full">
              ابدأ اللعب
            </button>
          </GlassCard>
        )}

        {/* GAME */}
        {started && !gameEnded && (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

            <div>
              {roundReady ? (
                <GlassCard className="panel-animated p-10 text-center">
                  <h2 className="text-4xl font-black">
                    الجولة {currentRound}
                  </h2>

                  <button
                    onClick={beginRound}
                    className="btn-primary mt-6"
                  >
                    ابدأ الجولة
                  </button>
                </GlassCard>
              ) : (
                currentGameBoard
              )}
            </div>

            <GlassCard className="panel-animated p-6">
              <p>🏆 {side1}: {side1Score}</p>
              <p>🏆 {side2}: {side2Score}</p>
            </GlassCard>
          </div>
        )}

        {/* END */}
        {gameEnded && (
          <GlassCard className="panel-animated p-8 text-center">
            <h2 className="text-4xl font-black">انتهى التحدي</h2>

            <p className="mt-4 text-xl">
              {side1Score > side2Score ? side1 : side2}
            </p>

            <button onClick={resetGame} className="btn-primary mt-6">
              إعادة اللعب
            </button>
          </GlassCard>
        )}

      </div>

      {/* MODAL */}
      {showWinnerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black p-6 rounded-2xl">
            <button onClick={() => chooseWinner("side1")}>{side1}</button>
            <button onClick={() => chooseWinner("side2")}>{side2}</button>
          </div>
        </div>
      )}
    </main>
  );
}
