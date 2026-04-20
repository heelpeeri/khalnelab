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

type GameType = "word" | "draw" | "categories" | "scramble" | "wheel" | "quiz";
type SessionMode = "quick" | "session";
type PlayMode = "solo" | "teams";
type WinnerType = "side1" | "side2" | "none";

const SESSION_GAME_OPTIONS: {
  id: GameType;
  title: string;
  icon: string;
  hint: string;
}[] = [
  {
    id: "quiz",
    title: "الأسئلة",
    icon: "❓",
    hint: "اختر فئة، جاوب، ثم حدّد من فاز.",
  },
  {
    id: "word",
    title: "خمن الكلمة",
    icon: "💬",
    hint: "خمن الكلمة حرف حرف.",
  },
  {
    id: "scramble",
    title: "حروف بالخلاط",
    icon: "🧩",
    hint: "رتب الحروف بأسرع وقت.",
  },
  {
    id: "wheel",
    title: "لف وخمن",
    icon: "🎡",
    hint: "لف العجلة ثم اختر حرفًا أو حل الكلمة.",
  },
  {
    id: "categories",
    title: "إنسان حيوان نبات جماد بلاد",
    icon: "🌍",
    hint: "كل الإجابات تبدأ بنفس الحرف.",
  },
  {
    id: "draw",
    title: "خمن المثل",
    icon: "✏️",
    hint: "خمن المثل من الإيموجي.",
  },
];

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

function FinalWinnerOverlay({
  show,
  winnerName,
  isDraw,
  onClose,
}: {
  show: boolean;
  winnerName: string;
  isDraw: boolean;
  onClose: () => void;
}) {
  if (!show) return null;

  return (
    <div className="arcade-backdrop fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="arcade-card w-full max-w-2xl p-8 text-center md:p-10">
        <div className="arcade-stars">
          <span style={{ top: "10%", left: "12%" }}>✦</span>
          <span style={{ top: "18%", right: "14%" }}>✦</span>
          <span style={{ bottom: "18%", left: "16%" }}>✦</span>
          <span style={{ bottom: "12%", right: "12%" }}>✦</span>
          <span style={{ top: "45%", left: "8%" }}>+</span>
          <span style={{ top: "42%", right: "8%" }}>+</span>
        </div>

        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/80">
          FINAL RESULT
        </p>

        <h2 className="arcade-title mt-5">
          {isDraw ? "DRAW!" : "LEVEL UP!"}
        </h2>

        <p className="arcade-winner mt-6">
          {isDraw ? "تعادل" : winnerName}
        </p>

        <p className="arcade-subtitle mt-5 text-sm md:text-base">
          {isDraw
            ? "انتهى التحدي بدون فائز نهائي بعدد نقاط متساوٍ"
            : "الفريق الفائز أنهى التحدي بأعلى عدد من النقاط"}
        </p>

        <button
          onClick={onClose}
          className="arcade-button mt-8"
          type="button"
        >
          START
        </button>
      </div>
    </div>
  );
}

export default function MatchPage() {
  const [sessionMode, setSessionMode] = useState<SessionMode>("quick");

  const [mode, setMode] = useState<PlayMode>("teams");
  const [side1, setSide1] = useState("فريق 1");
  const [side2, setSide2] = useState("فريق 2");
  const [rounds, setRounds] = useState(3);

  const [selectedGame, setSelectedGame] = useState<GameType>("word");
  const [selectedSessionGames, setSelectedSessionGames] = useState<GameType[]>([
    "quiz",
    "word",
    "scramble",
  ]);

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

  const [showFinalWinnerOverlay, setShowFinalWinnerOverlay] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    const game = params.get("game");

    if (modeParam === "session") {
      setSessionMode("session");
      return;
    }

    setSessionMode("quick");

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

  useEffect(() => {
    if (gameEnded) {
      setShowFinalWinnerOverlay(true);
    }
  }, [gameEnded]);

  const activeGame =
    sessionMode === "session"
      ? selectedSessionGames[currentRound - 1] ?? selectedSessionGames[0] ?? "word"
      : selectedGame;

  const side1Label = mode === "teams" ? "اسم فريق 1" : "اسم اللاعب 1";
  const side2Label = mode === "teams" ? "اسم فريق 2" : "اسم اللاعب 2";
  const currentTurnLabel = mode === "teams" ? "دور الفريق" : "دور اللاعب";
  const winnerQuestionLabel =
    mode === "teams"
      ? "اختر الجهة الفائزة في هذه الجولة"
      : "اختر الفائز في هذه الجولة";

  const currentTurnName = currentRound % 2 === 1 ? side1 : side2;

  const gameMeta = useMemo(() => {
    const found = SESSION_GAME_OPTIONS.find((game) => game.id === activeGame);

    return (
      found ?? {
        id: "word",
        title: "خمن الكلمة",
        icon: "💬",
        hint: "خمن الكلمة حرف حرف.",
      }
    );
  }, [activeGame]);

  const isDraw = side1Score === side2Score;
  const finalWinnerName = isDraw
    ? "الفريقان"
    : side1Score > side2Score
    ? side1
    : side2;

  function toggleSessionGame(gameId: GameType) {
    setSelectedSessionGames((prev) => {
      if (prev.includes(gameId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== gameId);
      }
      return [...prev, gameId];
    });
  }

  function startGame() {
    if (!side1.trim() || !side2.trim()) return;

    if (sessionMode === "session" && selectedSessionGames.length === 0) return;

    const nextRounds =
      sessionMode === "session" ? selectedSessionGames.length : rounds;

    setStarted(true);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setGameEnded(false);
    setShowFinalWinnerOverlay(false);
    setRoundReady(true);
    setRoundSeed(1);
    setQuizQuestionIndex(0);
    setQuizQuestionTotal(0);
    setRounds(nextRounds);
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
    setQuizQuestionIndex(0);
    setQuizQuestionTotal(0);

    if (currentRound >= rounds) {
      setGameEnded(true);
      return;
    }

    setCurrentRound((r) => r + 1);
    setRoundReady(true);
    setRoundSeed((s) => s + 1);
  }

  function resetGame() {
    setStarted(false);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setShowWinnerModal(false);
    setGameEnded(false);
    setShowFinalWinnerOverlay(false);
    setRoundReady(true);
    setRoundSeed(1);
    setQuizQuestionIndex(0);
    setQuizQuestionTotal(0);
    setRounds(sessionMode === "session" ? selectedSessionGames.length || 1 : 3);
  }

  const currentGameBoard =
    activeGame === "word" ? (
      <WordGame onRoundEnd={endRound} roundKey={roundSeed} />
    ) : activeGame === "draw" ? (
      <ProverbGame
        mode={mode}
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
      />
    ) : activeGame === "scramble" ? (
      <ScrambleGame
        mode={mode}
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
      />
    ) : activeGame === "wheel" ? (
      <WheelGame
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
      />
    ) : activeGame === "quiz" ? (
      <QuizGame
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
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
              {sessionMode === "session" ? "SESSION MODE" : "QUICK MODE"}
            </p>
            <h1 className="mt-1 text-3xl font-black">
              {sessionMode === "session" ? "تحدي الجلسة" : "تحدي سريع"}
            </h1>
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
                <p className="text-xs text-white/55">الوضع الحالي</p>
                <p className="mt-1 font-black">
                  {sessionMode === "session"
                    ? "🏆 تحدي الجلسة"
                    : `${gameMeta.icon} ${gameMeta.title}`}
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

              {sessionMode === "quick" && (
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
                    <option value="quiz">الأسئلة</option>
                  </select>
                </div>
              )}
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

            {sessionMode === "quick" ? (
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
            ) : (
              <>
                <div className="mt-6">
                  <label className="mb-3 block text-sm font-bold">
                    اختر الألعاب
                  </label>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {SESSION_GAME_OPTIONS.map((game) => {
                      const isSelected = selectedSessionGames.includes(game.id);

                      return (
                        <button
                          key={game.id}
                          type="button"
                          onClick={() => toggleSessionGame(game.id)}
                          className={`rounded-2xl border p-4 text-right transition ${
                            isSelected
                              ? "border-cyan-300/40 bg-cyan-400/15 shadow-[0_0_18px_rgba(34,211,238,0.14)]"
                              : "border-white/15 bg-white/8 hover:bg-white/12"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-2xl">
                              {game.icon}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-lg font-black">{game.title}</h3>
                                <span className="text-sm">
                                  {isSelected ? "✅" : "⬜"}
                                </span>
                              </div>

                              <p className="mt-1 text-sm text-white/70">
                                {game.hint}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-right">
                  <p className="text-sm text-white/60">عدد الجولات</p>
                  <p className="mt-1 font-black text-yellow-100">
                    {selectedSessionGames.length} جولة
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    كل لعبة مختارة = جولة واحدة داخل تحدي الجلسة
                  </p>
                </div>
              </>
            )}

            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-right">
              <p className="text-sm text-white/60">مختصر اللعبة</p>
              <p className="mt-1 text-white/90">
                {sessionMode === "session"
                  ? "اختر الألعاب اللي تبيها، وكل لعبة تمثل جولة مستقلة داخل التحدي."
                  : gameMeta.hint}
              </p>
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

                <div className="rounded-2xl border border-pink-300/15 bg-pink-500/10 p-4">
                  <p className="text-sm text-white/70">اللعبة الحالية</p>
                  <p className="mt-1 text-xl font-black text-pink-100">
                    {gameMeta.icon} {gameMeta.title}
                  </p>
                </div>

                {activeGame === "quiz" && quizQuestionTotal > 0 && (
                  <div className="rounded-2xl border border-yellow-300/15 bg-yellow-400/10 p-4">
                    <p className="text-sm text-white/70">أسئلة الجولة</p>
                    <p className="mt-1 text-2xl font-black text-yellow-200">
                      {quizQuestionIndex} / {quizQuestionTotal}
                    </p>
                  </div>
                )}

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

      <FinalWinnerOverlay
        show={showFinalWinnerOverlay}
        winnerName={finalWinnerName}
        isDraw={isDraw}
        onClose={() => setShowFinalWinnerOverlay(false)}
      />
    </main>
  );
}
