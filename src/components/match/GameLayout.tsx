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
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 text-center">

      {/* 🔥 الهيدر */}
      <div className="mb-5">
        <h2 className="text-2xl sm:text-3xl font-black tracking-wide">
          {title}
        </h2>
      </div>

      {/* 🔥 السكور (محسن) */}
      <div className="flex items-center justify-between gap-3 mb-4">

        {/* فريق 1 */}
        <div className="flex-1 rounded-2xl border border-pink-400/30 bg-pink-500/10 py-3 px-2">
          <p className="text-sm text-white/60">{side1}</p>
          <p className="text-2xl font-black text-pink-300">
            {side1Score}
          </p>
        </div>

        {/* الوسط */}
        <div className="text-xl font-black text-yellow-300 px-2">
          VS
        </div>

        {/* فريق 2 */}
        <div className="flex-1 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 py-3 px-2">
          <p className="text-sm text-white/60">{side2}</p>
          <p className="text-2xl font-black text-cyan-300">
            {side2Score}
          </p>
        </div>

      </div>

      {/* 🔥 الدور */}
      <div className="mb-4">
        <span className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/80">
          🎯 الدور: {turn}
        </span>
      </div>

      {/* 🔥 الكارد الرئيسي */}
      <div className="glass rounded-3xl p-4 sm:p-6">

        {/* اللعبة */}
        <div className="mb-6">
          {children}
        </div>

        {/* زر */}
        <button
          onClick={onEndRound}
          className="btn-primary w-full sm:w-auto px-10"
        >
          إنهاء الجولة
        </button>

      </div>
    </div>
  );
}
