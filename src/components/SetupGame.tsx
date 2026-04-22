"use client";

import { useState } from "react";

export default function SetupGame({ gameName }: { gameName: string }) {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">

        {/* اسم اللعبة */}
        <h1 className="mb-10 text-4xl font-black">{gameName}</h1>

        {/* الفرق */}
        <div className="flex flex-col gap-4 md:flex-row">
          <input
            placeholder="اسم الفريق 1"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            className="input text-center"
          />

          <input
            placeholder="اسم الفريق 2"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            className="input text-center"
          />
        </div>

        {/* زر البداية */}
        <button
          className="btn-primary mt-8 w-full text-lg"
          onClick={() => {
            if (!team1 || !team2) {
              alert("اكتب أسماء الفرق أول");
              return;
            }

            console.log({ team1, team2 });
            // هنا توديه للعبة
          }}
        >
          ابدأ اللعب
        </button>

        {/* شرح صغير */}
        <button className="mt-4 text-sm text-white/60 hover:text-white">
          ؟ شرح اللعبة
        </button>

      </div>
    </div>
  );
}
