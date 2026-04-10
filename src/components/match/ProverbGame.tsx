'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type PlayMode = "solo" | "teams";
type WinnerType = "side1" | "side2" | "none";

export default function ProverbGame({
  mode,
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
}: {
  mode: PlayMode;
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
  ];

  const ROUND_TIME = 20;
  const [index, setIndex] = useState(() => Math.floor(Math.random() * puzzles.length));
  const current = useMemo(() => puzzles[index], [index]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [revealed, setRevealed] = useState(false);

  const [side1Ready, setSide1Ready] = useState(false);
  const [side2Ready, setSide2Ready] = useState(false);
  const [side1Time, setSide1Time] = useState<number | null>(null);
  const [side2Time, setSide2Time] = useState<number | null>(null);

  const readyLabel = mode === "teams" ? "خلصنا" : "خلصت";

  const instructionText =
    mode === "teams"
      ? 'إذا انتهى الفريق، يقول لصاحب الجلسة: "خلصنا" ثم يسجلها صاحب الجلسة'
      : 'إذا انتهى اللاعب، يقول لصاحب الجلسة: "خلصت" ثم يسجلها صاحب الجلسة';

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
    <GlassCard className="panel-animated min-h-[780px] p-8 text-center">
      <h2 className="text-2xl font-black">خمن المثل</h2>

      <div className="mt-4 rounded-3xl border border-white/20 bg-white/10 p-4 text-sm leading-7 text-white/80">
        {instructionText}
      </div>

      <div className="mx-auto mt-4 w-full max-w-md">
        <div className="mb-1 flex justify-between text-sm text-white/80">
          <span>الوقت</span>
          <span className={timeLeft <= 5 ? "animate-pulse-soft font-black text-red-300" : "font-black"}>
            {timeLeft}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-white transition-all duration-1000"
            style={{ width: `${(timeLeft / 20) * 100}%` }}
          />
        </div>
      </div>

      <div className="animate-fade-in-up mt-8 text-6xl">{current.emoji}</div>

      {!revealed && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-white/80">
          ركز... الوقت يمشي ⏳
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{side1Name}</p>
          <p className="mt-2 text-sm text-white/80">
            {side1Ready ? "✅ تم التسجيل" : "⏳ لم يسجل بعد"}
          </p>
          {side1Time !== null && (
            <p className="mt-1 text-xs text-white/70">تم تسجيله خلال {side1Time} ثانية</p>
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
            {readyLabel}
          </button>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center">
          <p className="text-lg font-black">{side2Name}</p>
          <p className="mt-2 text-sm text-white/80">
            {side2Ready ? "✅ تم التسجيل" : "⏳ لم يسجل بعد"}
          </p>
          {side2Time !== null && (
            <p className="mt-1 text-xs text-white/70">تم تسجيله خلال {side2Time} ثانية</p>
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
            {readyLabel}
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
          <div className="winner-animated mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
            <p className="text-lg font-black">⏰ انتهى الوقت!</p>
          </div>

          <div className="winner-animated mt-4 rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm text-white/70">الإجابة الصحيحة</p>
            <p className="mt-2 text-2xl font-black">{current.answer}</p>
          </div>
        </>
      )}
    </GlassCard>
  );
}
