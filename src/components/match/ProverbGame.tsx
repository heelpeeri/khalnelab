'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type WinnerType = "side1" | "side2" | "none";

export default function ProverbGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
}) {
  const puzzles = [
    { emoji: "🐒👩🦌", answer: "القرد في عين امه غزال" },
    { emoji: "🪢🤥⏳", answer: "حبل الكذب قصير" },
    { emoji: "👊😭🏃🗣️", answer: "ضربني وبكى سبقني واشتكى" },
    { emoji: "🐦✋🔟🌳", answer: "طير باليد ولا عشره بالشجره" },
    { emoji: "🚪💨🔒😌", answer: "الباب اللي يجي منه ريح سده واستريح" },
    { emoji: "🦵📏🛏️", answer: "مد رجلك على قد لحافك" },
    { emoji: "👤🍯👅❌", answer: "اذا كان صاحبك عسل لا تلحسه كله" },
    { emoji: "🌴📏🐐🧠", answer: "الطول طول نخله والعقل عقل صخله" },
    { emoji: "👁️😒🪵", answer: "عين الحسود فيها عود" },
    { emoji: "🍇🙅‍♂️😖", answer: "اللي ما يطول العنب حامض عنه يقول" },
    { emoji: "🦅🤷‍♂️🔥🍗", answer: "اللي ما يعرف الصقر يشويه" },
    { emoji: "❤️👁️❌", answer: "الحب اعمى" },
    { emoji: "😴👑", answer: "النوم سلطان" },
    { emoji: "✋❌👏", answer: "يد وحده ما تصفق" },
    { emoji: "👅🐎", answer: "لسانك حصانك" },
    { emoji: "❓👨‍🔧✔️👨‍⚕️❌", answer: "اسال مجرب ولا تسال طبيب" },
    { emoji: "🔥➡️💨😡", answer: "لا تشب النار وتزعل من دخانها" },
    { emoji: "🐐🕊️❌", answer: "عنزه ولو طارت" },
    { emoji: "🐦🐦👀", answer: "الطيور على اشكالها تقع" },
    { emoji: "💪📚🏆", answer: "من جد وجد" },
    { emoji: "🏺🔄👩", answer: "اقلب الجره على فمها تطلع على امها" },
    { emoji: "💰⚪➡️🌑", answer: "القرش الابيض لليوم الاسود" },
    { emoji: "👺👨‍🦯👀", answer: "يحسدون الاعمى على كبر عيونه" },
    { emoji: "🦶🔥🦶💧", answer: "اللي رجله بالنار مو مثل اللي رجله بالموية" },
    { emoji: "🐂❓🥛", answer: "قالوا ثور قالوا احلبوه" },
    { emoji: "🌹❌😒🔴😊", answer: "ما لقوا للورد عيب قالوا يا احمر الخدين" },
    { emoji: "🔁🔁📖🐴", answer: "التكرار يعلم الحمار" },
    { emoji: "🌴🔩🦵", answer: "التمر مسامير الركب" },
    { emoji: "🐄🕋🦴", answer: "اذا حجت البقر على قرونها" },
    { emoji: "🐐👀🥛", answer: "شف وجه العنز واحلب لبن" },
    { emoji: "👅🔁👂", answer: "لسانه يلوط اذانه" },
  ];

  const ROUND_TIME = 20;
  const [index, setIndex] = useState(
    () => Math.floor(Math.random() * puzzles.length)
  );
  const current = useMemo(() => puzzles[index], [index]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [revealed, setRevealed] = useState(false);

  const [side1Ready, setSide1Ready] = useState(false);
  const [side2Ready, setSide2Ready] = useState(false);
  const [side1Time, setSide1Time] = useState<number | null>(null);
  const [side2Time, setSide2Time] = useState<number | null>(null);

  const instructionText =
    'إذا انتهى الفريق، يقول لصاحب الجلسة: "خلصنا" ثم يسجلها صاحب الجلسة';

  useEffect(() => {
    setIndex(Math.floor(Math.random() * puzzles.length));
    setTimeLeft(ROUND_TIME);
    setRevealed(false);
    setSide1Ready(false);
    setSide2Ready(false);
    setSide1Time(null);
    setSide2Time(null);
  }, [roundKey]);

  useEffect(() => {
    if (revealed) return;

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, revealed]);

  return (
    <GlassCard className="relative min-h-[780px] overflow-hidden border border-pink-400/25 bg-[#10001f]/75 p-8 text-center shadow-[0_0_28px_rgba(255,0,153,0.15)] backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/75">
          EMOJI
        </p>
        <h2 className="mt-2 text-3xl font-black text-[#98ffb6] drop-shadow-[0_0_14px_rgba(152,255,182,0.35)]">
          خمن المثل
        </h2>

        <div className="mt-4 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-7 text-white/80">
          {instructionText}
        </div>

        <div className="mx-auto mt-4 w-full max-w-md">
          <div className="mb-1 flex justify-between text-sm text-white/80">
            <span>الوقت</span>
            <span
              className={
                timeLeft <= 5
                  ? "animate-pulse font-black text-red-300"
                  : "font-black text-yellow-200"
              }
            >
              {timeLeft}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300 transition-all duration-1000"
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-8 rounded-[32px] border border-white/10 bg-white/10 px-6 py-8 shadow-[0_0_18px_rgba(255,255,255,0.04)]">
          <div className="text-7xl drop-shadow-[0_0_16px_rgba(255,255,255,0.18)] md:text-8xl">
            {current.emoji}
          </div>
        </div>

        {!revealed && (
          <div className="mt-6 rounded-2xl border border-pink-400/20 bg-pink-500/10 p-4 text-white/80">
            ركز... الوقت يمشي ⏳
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-pink-400/20 bg-pink-500/10 p-4 text-center">
            <p className="text-lg font-black">{side1Name}</p>
            <p className="mt-2 text-sm text-white/80">
              {side1Ready ? "✅ تم التسجيل" : "⏳ لم يسجل بعد"}
            </p>
            {side1Time !== null && (
              <p className="mt-1 text-xs text-white/70">
                تم تسجيله خلال {side1Time} ثانية
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setSide1Ready(true);
                setSide1Time(ROUND_TIME - timeLeft);
              }}
              disabled={side1Ready || revealed}
              className="btn-primary mt-4 w-full disabled:opacity-50"
            >
              خلصنا
            </button>
          </div>

          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-center">
            <p className="text-lg font-black">{side2Name}</p>
            <p className="mt-2 text-sm text-white/80">
              {side2Ready ? "✅ تم التسجيل" : "⏳ لم يسجل بعد"}
            </p>
            {side2Time !== null && (
              <p className="mt-1 text-xs text-white/70">
                تم تسجيله خلال {side2Time} ثانية
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setSide2Ready(true);
                setSide2Time(ROUND_TIME - timeLeft);
              }}
              disabled={side2Ready || revealed}
              className="btn-primary mt-4 w-full disabled:opacity-50"
            >
              خلصنا
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="btn-primary"
          >
            إظهار المثل
          </button>

          <button
            type="button"
            onClick={() => onRoundEnd()}
            className="btn-primary"
          >
            إنهاء الجولة
          </button>
        </div>

        {revealed && (
          <>
            <div className="mt-6 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-4 text-center shadow-[0_0_18px_rgba(250,204,21,0.12)]">
              <p className="text-lg font-black text-yellow-100">⏰ انتهى الوقت!</p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm text-white/70">الإجابة الصحيحة</p>
              <p className="mt-2 text-2xl font-black text-white">
                {current.answer}
              </p>
            </div>
          </>
        )}
      </div>
    </GlassCard>
  );
}
