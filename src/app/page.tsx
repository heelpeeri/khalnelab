'use client';

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import WordGame from "@/components/match/WordGame";
import CategoriesGame from "@/components/match/CategoriesGame";
import ProverbGame from "@/components/match/ProverbGame";
import ScrambleGame from "@/components/match/ScrambleGame";
import WheelGame from "@/components/match/WheelGame";
import QuizGame from "@/components/match/QuizGame";

export default function MatchPage() {
  const searchParams = useSearchParams();
  const game = searchParams.get("game");

  const [roundKey, setRoundKey] = useState(0);

  const nextRound = () => {
    setRoundKey((prev) => prev + 1);
  };

  const side1 = "الفريق 1";
  const side2 = "الفريق 2";

  return (
    <main className="min-h-screen p-6">
      {!game && <p>اختر لعبة من الصفحة الرئيسية</p>}

      {game === "word" && (
        <WordGame onRoundEnd={nextRound} roundKey={roundKey} />
      )}

      {game === "categories" && (
        <CategoriesGame
          mode="teams"
          side1Name={side1}
          side2Name={side2}
          onRoundEnd={nextRound}
          roundKey={roundKey}
        />
      )}

      {game === "draw" && (
        <ProverbGame
          mode="teams"
          side1Name={side1}
          side2Name={side2}
          onRoundEnd={nextRound}
          roundKey={roundKey}
        />
      )}

      {game === "scramble" && (
        <ScrambleGame
          mode="teams"
          side1Name={side1}
          side2Name={side2}
          onRoundEnd={nextRound}
          roundKey={roundKey}
        />
      )}

      {game === "wheel" && (
        <WheelGame
          side1Name={side1}
          side2Name={side2}
          onRoundEnd={nextRound}
          roundKey={roundKey}
        />
      )}

      {game === "quiz" && (
        <QuizGame
          mode="teams"
          side1Name={side1}
          side2Name={side2}
          onRoundEnd={nextRound}
          roundKey={roundKey}
        />
      )}
    </main>
  );
}
