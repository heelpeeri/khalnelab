'use client';

export default function GameLayout({
  title,
  side1,
  side2,
  side1Score,
  side2Score,
  turn,
  children,
}: {
  title: string;
  side1: string;
  side2: string;
  side1Score: number;
  side2Score: number;
  turn: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
      <div className="glass rounded-[28px] border border-white/10 bg-[#121028]/80 p-4 text-center shadow-[0_0_30px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-6">
        <h2 className="mb-2 text-2xl font-black text-white sm:text-3xl">
          {title}
        </h2>

        <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
            <p className="text-base font-bold sm:text-lg">{side2}</p>
            <p className="mt-1 text-4xl font-black text-cyan-200">{side2Score}</p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-lg font-black text-white sm:text-xl">{turn}</p>
            <div className="mt-2 flex gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>
          </div>

          <div className="rounded-2xl border border-pink-300/20 bg-pink-500/10 p-4">
            <p className="text-base font-bold sm:text-lg">{side1}</p>
            <p className="mt-1 text-4xl font-black text-pink-200">{side1Score}</p>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#0d1236]/70 p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
