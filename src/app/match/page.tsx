'use client';

import { useEffect, useState } from "react";

import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

import WordGame from "@/components/match/WordGame";
import ProverbGame from "@/components/match/ProverbGame";
import CategoriesGame from "@/components/match/CategoriesGame";
import ScrambleGame from "@/components/match/ScrambleGame";
import { WheelGame } from "@/components/match/WheelGame";

type GameType = "word" | "draw" | "categories" | "scramble" | "wheel";
type PlayMode = "solo" | "teams";
type WinnerType = "side1" | "side2" | "none";

function MatchupBadge({ side1, side2 }: { side1: string; side2: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3">
      <span className="bg-white/15 px-3 py-1 rounded-xl font-bold">{side1}</span>
      <span className="text-white/60">ضد</span>
      <span className="bg-white/15 px-3 py-1 rounded-xl font-bold">{side2}</span>
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
    if (game === "word" || game === "draw" || game === "categories" || game === "scramble" || game === "wheel") {
      setSelectedGame(game);
    }
  }, []);

  function getGameTitle(game: GameType) {
    if (game === "word") return "خمن الكلمة";
    if (game === "draw") return "خمن المثل";
    if (game === "scramble") return "حروف بالخلاط";
    if (game === "wheel") return "لف وخمن";
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
    if (winner) return chooseWinner(winner);
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
      <div className="mx-auto max-w-7xl">

        {!started && (
          <GlassCard className="p-6 space-y-4">

            <select value={mode} onChange={(e) => setMode(e.target.value as PlayMode)} className="input">
              <option value="teams">فريقين</option>
              <option value="solo">فردي</option>
            </select>

            <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value as GameType)} className="input">
              <option value="word">خمن الكلمة</option>
              <option value="draw">خمن المثل</option>
              <option value="categories">إنسان حيوان نبات جماد</option>
              <option value="scramble">حروف بالخلاط</option>
              <option value="wheel">لف وخمن</option>
            </select>

            <input value={side1} onChange={(e) => setSide1(e.target.value)} className="input" />
            <input value={side2} onChange={(e) => setSide2(e.target.value)} className="input" />

            <button onClick={startGame} className="btn-primary w-full active:scale-95">
              ابدأ
            </button>

          </GlassCard>
        )}

        {started && !gameEnded && (
          <div className="space-y-6">

            {roundReady ? (
              <GlassCard className="p-8 text-center">
                <h2 className="text-4xl font-black">
                  الجولة {currentRound}
                </h2>

                <p className="mt-4">{getGameTitle(selectedGame)}</p>

                <div className="mt-4">
                  <MatchupBadge side1={side1} side2={side2} />
                </div>

                <button onClick={beginRound} className="btn-primary mt-6 active:scale-95">
                  ابدأ الجولة
                </button>
              </GlassCard>
            ) : (
              currentGameBoard
            )}

          </div>
        )}

        {gameEnded && (
          <GlassCard className="p-8 text-center">

            <h2 className="text-4xl font-black">
              🏆 انتهى التحدي
            </h2>

            <p className="mt-4 text-2xl font-black">
              {side1Score > side2Score ? side1 : side2}
            </p>

            <button onClick={resetGame} className="btn-primary mt-6 active:scale-95">
              إعادة اللعب
            </button>

          </GlassCard>
        )}

      </div>
    </main>
  );
}
