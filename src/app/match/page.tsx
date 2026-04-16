'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";
import WordGame from "@/components/match/WordGame";
import ProverbGame from "@/components/match/ProverbGame";
import CategoriesGame from "@/components/match/CategoriesGame";
import ScrambleGame from "@/components/match/ScrambleGame";
import WheelGame from "@/components/match/WheelGame";
import QuizGame from "@/components/match/QuizGame";

type GameType =
  | "word"
  | "draw"
  | "categories"
  | "scramble"
  | "wheel"
  | "quiz";

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

  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizQuestionTotal, setQuizQuestionTotal] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");

    if (
      game === "word" ||
      game === "draw" ||
      game === "categories" ||
      game === "scramble" ||
      game === "wheel" ||
      game === "quiz"
    ) {
      setSelectedGame(game);
    }
  }, []);

  const currentTurnName = currentRound % 2 === 1 ? side1 : side2;

  function startGame() {
    if (!side1.trim() || !side2.trim()) return;

    setStarted(true);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setGameEnded(false);

    // 👇 مهم
    setRoundReady(selectedGame === "quiz" ? false : true);

    setRoundSeed(1);
    setQuizQuestionIndex(0);
    setQuizQuestionTotal(0);
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

    // 👇 مهم
    setRoundReady(selectedGame === "quiz" ? false : true);

    setRoundSeed((s) => s + 1);
    setQuizQuestionIndex(0);
    setQuizQuestionTotal(0);
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
    setQuizQuestionIndex(0);
    setQuizQuestionTotal(0);
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
    ) : selectedGame === "quiz" ? (
      <QuizGame
        key={`quiz-${roundSeed}`} // 👈 مهم جدًا
        mode={mode}
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
        onProgressChange={(current, total) => {
          setQuizQuestionIndex(current);
          setQuizQuestionTotal(total);
        }}
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

        {!started && (
          <GlassCard className="mx-auto max-w-5xl p-6">
            <h2 className="text-2xl font-black">جهّز التحدي</h2>

            <select
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="input mt-4"
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>

            <button onClick={startGame} className="btn-primary mt-6 w-full">
              ابدأ اللعب
            </button>
          </GlassCard>
        )}

        {started && !gameEnded && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

            <div>
              {selectedGame === "quiz"
                ? currentGameBoard
                : roundReady
                ? (
                  <button onClick={beginRound} className="btn-primary">
                    ابدأ الجولة
                  </button>
                )
                : currentGameBoard}
            </div>

            <GlassCard className="p-6">
              <h3 className="text-xl font-black">لوحة التحدي</h3>

              <div className="mt-4">
                <p>الجولة</p>

                {/* 👇 FIX 3/1 */}
                <p dir="ltr" className="text-3xl font-black text-left">
                  {currentRound} / {rounds}
                </p>
              </div>

              {selectedGame === "quiz" && quizQuestionTotal > 0 && (
                <div className="mt-4">
                  <p>أسئلة الجولة</p>

                  {/* 👇 FIX */}
                  <p dir="ltr" className="text-2xl font-black text-left">
                    {quizQuestionIndex} / {quizQuestionTotal}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <p>{side1} - {side1Score}</p>
                <p>{side2} - {side2Score}</p>
              </div>
            </GlassCard>

          </div>
        )}

        {gameEnded && (
          <div className="text-center">
            <h2 className="text-3xl font-black">انتهى التحدي</h2>
            <button onClick={resetGame} className="btn-primary mt-6">
              إعادة اللعب
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
