'use client';

export default function GameLayout({
  title,
  side1,
  side2,
  side1Score,
  side2Score,
  turn,
  children,
  onEndRound,
}: {
  title: string;
  side1: string;
  side2: string;
  side1Score: number;
  side2Score: number;
  turn: string;
  children: React.ReactNode;
  onEndRound: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">

      {/* الكارد */}
      <div className="glass rounded-3xl p-5 sm:p-6 text-center border border-white/10 bg-[#121028]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.4)]">

        {/* العنوان */}
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-5 tracking-wide">
          {title}
        </h2>

        {/* السكور */}
        <div className="flex items-center justify-between mb-5 text-sm sm:text-lg font-bold">

          {/* فريق 1 */}
          <div className="flex-1 text-right text-white/80 truncate">
            {side1}
          </div>

          {/* النتيجة */}
          <div className="px-4 py-1 rounded-xl bg-[#1c1a35] text-yellow-300 font-black shadow-inner">
            {side1Score} - {side2Score}
          </div>

          {/* فريق 2 */}
          <div className="flex-1 text-left text-white/80 truncate">
            {side2}
          </div>

        </div>

        {/* الدور */}
        <div className="mb-4">
          <span className="inline-block px-4 py-1 rounded-full bg-[#1c1a35] text-white/80 text-xs sm:text-sm">
            الدور: {turn}
          </span>
        </div>

        {/* خط */}
        <div className="border-t border-white/10 my-4"></div>

        {/* اللعبة */}
        <div className="mb-6">
          {children}
        </div>

        {/* خط */}
        <div className="border-t border-white/10 my-4"></div>

        {/* زر إنهاء */}
        <button
          onClick={onEndRound}
          className="btn-primary w-full sm:w-auto px-8 py-3 text-sm sm:text-base"
        >
          إنهاء الجولة
        </button>

      </div>
    </div>
  );
}
