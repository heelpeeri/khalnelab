'use client';

export default function GameLayout({
  title,
  side1,
  side2,
  side1Score,
  side2Score,
  turn,
  currentRound,
  totalRounds,
  badge = "1",
  children,
  onEndRound,
}: {
  title: string;
  side1: string;
  side2: string;
  side1Score: number;
  side2Score: number;
  turn: string;
  currentRound: number;
  totalRounds: number;
  badge?: string;
  children: React.ReactNode;
  onEndRound: () => void;
}) {
  const isSide1Turn = turn === side1;
  const isSide2Turn = turn === side2;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
      <div className="arcade-panel relative rounded-[28px] p-4 sm:p-6 text-center">
        <div className="arcade-level-badge absolute right-4 top-4">
          {badge}
        </div>

        <div className="mb-4 text-center">
          <h2 className="arcade-title-main">{title}</h2>
          <p className="arcade-title-sub">
            الجولة {currentRound} من {totalRounds}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
          <div className={`arcade-team arcade-team-pink ${isSide1Turn ? "arcade-team-active-pink" : ""}`}>
            <p className="arcade-team-name">{side1}</p>
            <p className="arcade-team-score arcade-team-score-pink">{side1Score}</p>
          </div>

          <div className={`arcade-turn ${isSide1Turn ? "arcade-turn-pink" : isSide2Turn ? "arcade-turn-cyan" : ""}`}>
            <p className="arcade-turn-text">دور {turn}</p>
            <div className="arcade-turn-dots">
              <span className={isSide1Turn ? "active-pink" : ""}></span>
              <span></span>
              <span className={isSide2Turn ? "active-cyan" : ""}></span>
              <span></span>
            </div>
          </div>

          <div className={`arcade-team arcade-team-cyan ${isSide2Turn ? "arcade-team-active-cyan" : ""}`}>
            <p className="arcade-team-name">{side2}</p>
            <p className="arcade-team-score arcade-team-score-cyan">{side2Score}</p>
          </div>
        </div>

        <div className="arcade-board-frame mb-6">
          {children}
        </div>

        <button onClick={onEndRound} className="arcade-end-button">
          إنهاء الجولة
        </button>
      </div>
    </div>
  );
}
