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
    <div className="glass mx-auto w-full max-w-3xl p-5 sm:p-6 text-center">

      {/* اسم اللعبة */}
      <h2 className="text-2xl sm:text-3xl font-black mb-4">
        {title}
      </h2>

      {/* السكور */}
      <div className="flex items-center justify-between text-lg sm:text-xl font-bold mb-4">

        <div className="flex-1 text-right">
          {side1}
        </div>

        <div className="px-4 text-yellow-300 font-black">
          {side1Score} - {side2Score}
        </div>

        <div className="flex-1 text-left">
          {side2}
        </div>

      </div>

      {/* الدور */}
      <p className="text-white/70 mb-5 text-sm sm:text-base">
        الدور: {turn}
      </p>

      {/* خط */}
      <div className="border-t border-white/10 my-4"></div>

      {/* منطقة اللعبة */}
      <div className="mb-6">
        {children}
      </div>

      {/* خط */}
      <div className="border-t border-white/10 my-4"></div>

      {/* زر */}
      <button
        onClick={onEndRound}
        className="btn-primary w-full sm:w-auto px-10"
      >
        إنهاء الجولة
      </button>

    </div>
  );
}
