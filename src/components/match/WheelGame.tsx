'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { GlassCard } from "@/components/GlassCard";

type WinnerType = "side1" | "side2";
type Turn = "side1" | "side2";
type Phase = "spin" | "result" | "guess" | "celebrate";
type Value = number | "bankrupt" | "lose";

const SEGMENTS = [
  { label: "100", value: 100 as Value, color: "#22c55e" },
  { label: "200", value: 200 as Value, color: "#3b82f6" },
  { label: "300", value: 300 as Value, color: "#a855f7" },
  { label: "500", value: 500 as Value, color: "#f59e0b" },
  { label: "إفلاس", value: "bankrupt" as Value, color: "#ef4444" },
  { label: "خسارة الدور", value: "lose" as Value, color: "#6b7280" },
];

const PUZZLES = [
  { answer: "معصوب", category: "أكل" },
  { answer: "مقشوش", category: "أكل" },
  { answer: "قرصان", category: "أكل" },
  { answer: "مثلوثة", category: "أكل" },

  { answer: "أسعد الزهراني", category: "ممثل سعودي" },
  { answer: "عبدالمحسن النمر", category: "ممثل سعودي" },
  { answer: "خالد سامي", category: "ممثل سعودي" },
  { answer: "خالد صقر", category: "ممثل سعودي" },

  { answer: "سويسرا", category: "دولة" },
  { answer: "كولومبيا", category: "دولة" },
  { answer: "المكسيك", category: "دولة" },
  { answer: "جمهورية نيكاراغوا", category: "دولة" },

  { answer: "قوتشي", category: "براند عالمي" },
  { answer: "كارتير", category: "براند عالمي" },
  { answer: "لويس فيتون", category: "براند عالمي" },

  { answer: "تاهو", category: "سيارة" },
  { answer: "كورولا", category: "سيارة" },
  { answer: "ازيرا", category: "سيارة" },
  { answer: "اكسنت", category: "سيارة" },

  { answer: "ريد بول", category: "مشروب" },
  { answer: "كينزا", category: "مشروب" },
  { answer: "دكتور بيبر", category: "مشروب" },

  { answer: "روبرتو كارلوس", category: "لاعب" },
  { answer: "بنزيما", category: "لاعب" },
  { answer: "رونالدينيو", category: "لاعب" },

  { answer: "هنقرستيشن", category: "تطبيق" },
  { answer: "اوتلوك", category: "تطبيق" },
  { answer: "المسافر", category: "تطبيق" },

  { answer: "وينديز", category: "مطعم" },
  { answer: "بوبايز", category: "مطعم" },
  { answer: "بيت الشواية", category: "مطعم" },
  { answer: "بيت الشاورما", category: "مطعم" },
  { answer: "دجاج تكساس", category: "مطعم" },

  { answer: "مكتبة جرير", category: "شركة سعودية" },
  { answer: "أرامكو السعودية", category: "شركة سعودية" },
  { answer: "طيران ناس", category: "شركة سعودية" },
  { answer: "العبيكان للنشر", category: "شركة سعودية" },

  { answer: "الأحوال المدنية", category: "جهة حكومية" },
  { answer: "أمانة الرياض", category: "جهة حكومية" },
  { answer: "وزارة السياحة", category: "جهة حكومية" },
  { answer: "وزارة الرياضة", category: "جهة حكومية" },

  { answer: "الأمن السيبراني", category: "تخصص" },
  { answer: "تكنولوجيا المعلومات", category: "تخصص" },
  { answer: "هندسة الطيران", category: "تخصص" },

  { answer: "أبو العصافير", category: "مسلسل سعودي" },
  { answer: "كلنا عيال قرية", category: "مسلسل سعودي" },
  { answer: "حارة الشيخ", category: "مسلسل سعودي" },

  { answer: "دار الحكمة", category: "جامعة سعودية" },
  { answer: "دار العلوم", category: "جامعة سعودية" },
  { answer: "الأمير سلطان", category: "جامعة سعودية" },
];

const LETTER_ROWS = [
  "دجحخهعغفقثصض",
  "طكمنتالبيسش",
  "ذظزوئر",
];

function normalizeArabic(text: string) {
  return text
    .trim()
    .replace(/\s+/g, "")
    .replace(/أ|إ|آ/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

function formatValue(value: Value | null) {
  if (value === null) return "لف العجلة";
  if (value === "bankrupt") return "💸 إفلاس";
  if (value === "lose") return "❌ خسارة الدور";
  return `+${value}`;
}

function splitAnswerWords(answer: string) {
  return answer.trim().split(/\s+/);
}

export default function WheelGame({
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
  const [turn, setTurn] = useState<Turn>("side1");
  const [phase, setPhase] = useState<Phase>("spin");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const [currentValue, setCurrentValue] = useState<Value | null>(null);
  const [winnerName, setWinnerName] = useState("");

  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const [wheelGlow, setWheelGlow] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);

  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickIndexRef = useRef<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const segmentAngle = 360 / SEGMENTS.length;
  const currentTeamName = turn === "side1" ? side1Name : side2Name;

  useEffect(() => {
    const q = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    setAnswer(q.answer);
    setCategory(q.category);
    setRevealed(Array(q.answer.length).fill(""));
    setUsedLetters([]);
    setTurn("side1");
    setPhase("spin");
    setRotation(0);
    setSpinning(false);
    setCurrentValue(null);
    setWinnerName("");
    setScore1(0);
    setScore2(0);
    setWheelGlow(false);
    setActiveSegmentIndex(null);

    return () => {
      if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    };
  }, [roundKey]);

  useEffect(() => {
    return () => {
      if (tickTimerRef.current) clearInterval(tickTimerRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const answerWords = useMemo(() => splitAnswerWords(answer), [answer]);

  const revealedWordGroups = useMemo(() => {
    let cursor = 0;
    return answerWords.map((word) => {
      const letters = revealed.slice(cursor, cursor + word.length);
      cursor += word.length + 1;
      return letters;
    });
  }, [answerWords, revealed]);

  function ensureAudio() {
    if (typeof window === "undefined") return;
    if (audioContextRef.current) return;

    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.gain.value = 0.022;
    gain.connect(ctx.destination);

    audioContextRef.current = ctx;
    masterGainRef.current = gain;
  }

  async function unlockAudio() {
    ensureAudio();
    if (!audioContextRef.current) return;

    if (audioContextRef.current.state === "suspended") {
      try {
        await audioContextRef.current.resume();
      } catch {}
    }
  }

  function playTickSound() {
    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.024);

    filter.type = "highpass";
    filter.frequency.setValueAtTime(420, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  function playFinalTickSound() {
    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(560, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.08);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  function nextTurn() {
    setTurn((prev) => (prev === "side1" ? "side2" : "side1"));
  }

  function finishRound(winner: WinnerType) {
    setWinnerName(winner === "side1" ? side1Name : side2Name);
    setPhase("celebrate");

    setTimeout(() => {
      onRoundEnd(winner);
    }, 1400);
  }

  function getPointerSegmentIndex(currentRotation: number) {
    const normalized = ((currentRotation % 360) + 360) % 360;
    const pointerAngle = (360 - normalized) % 360;
    return Math.floor(pointerAngle / segmentAngle) % SEGMENTS.length;
  }

  function startTicking() {
    if (tickTimerRef.current) clearInterval(tickTimerRef.current);

    tickTimerRef.current = setInterval(() => {
      setRotation((current) => {
        const idx = getPointerSegmentIndex(current);

        if (lastTickIndexRef.current !== idx) {
          lastTickIndexRef.current = idx;
          setActiveSegmentIndex(idx);
          setWheelGlow(true);
          playTickSound();
          setTimeout(() => setWheelGlow(false), 90);
        }

        return current;
      });
    }, 58);
  }

  function stopTicking(finalRotation: number) {
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }

    const idx = getPointerSegmentIndex(finalRotation);
    setActiveSegmentIndex(idx);
    setWheelGlow(true);
    playFinalTickSound();
    setTimeout(() => setWheelGlow(false), 180);
  }

  async function spinWheel() {
    if (spinning || phase !== "spin") return;

    await unlockAudio();

    setSpinning(true);

    const index = Math.floor(Math.random() * SEGMENTS.length);
    const value = SEGMENTS[index].value;
    setCurrentValue(value);

    const targetCenter = index * segmentAngle + segmentAngle / 2;
    const extraSpins = 8 * 360;
    const nextRotation =
      rotation +
      extraSpins +
      (360 - (rotation % 360)) +
      (360 - targetCenter);

    startTicking();
    setRotation(nextRotation);

    setTimeout(() => {
      stopTicking(nextRotation);
      setSpinning(false);
      setPhase("result");

      setTimeout(() => {
        if (value === "bankrupt") {
          if (turn === "side1") setScore1(0);
          else setScore2(0);

          setCurrentValue(null);
          nextTurn();
          setPhase("spin");
          return;
        }

        if (value === "lose") {
          setCurrentValue(null);
          nextTurn();
          setPhase("spin");
          return;
        }

        setPhase("guess");
      }, 850);
    }, 3000);
  }

  function pickLetter(letter: string) {
    if (phase !== "guess") return;
    if (usedLetters.includes(letter)) return;
    if (typeof currentValue !== "number") return;

    setUsedLetters((prev) => [...prev, letter]);

    let count = 0;
    const next = [...revealed];

    answer.split("").forEach((char, i) => {
      if (char === " ") return;

      if (normalizeArabic(char) === normalizeArabic(letter)) {
        next[i] = char;
        count++;
      }
    });

    setRevealed(next);

    if (count > 0) {
      const gained = count * currentValue;

      if (turn === "side1") setScore1((s) => s + gained);
      else setScore2((s) => s + gained);

      const solved = answer
        .split("")
        .every((char, i) => char === " " || next[i] !== "");

      if (solved) finishRound(turn);
      return;
    }

    setCurrentValue(null);
    nextTurn();
    setPhase("spin");
  }

  function solveWord() {
    if (phase === "celebrate") return;

    const guess = window.prompt("اكتب الكلمة كاملة");
    if (!guess) return;

    if (normalizeArabic(guess) === normalizeArabic(answer)) {
      finishRound(turn);
      return;
    }

    setCurrentValue(null);
    nextTurn();
    setPhase("spin");
  }

  return (
    <GlassCard className="min-h-[760px] p-4 text-center md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[28px] border border-white/10 bg-[#091039]/55 p-4 shadow-[0_0_30px_rgba(0,0,0,0.35)] md:p-6">
          <div className="mb-5 text-center">
            <h2 className="text-3xl font-black md:text-4xl">🎡 لف وخمن</h2>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100">
              <span className="text-white/70">التصنيف:</span>
              <span>{category}</span>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-pink-300/20 bg-pink-500/10 p-4">
              <p className="text-sm text-white/65">{side1Name}</p>
              <p className="mt-2 text-4xl font-black text-pink-200">{score1}</p>
            </div>

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 shadow-[0_0_18px_rgba(34,211,238,0.08)]">
              <p className="text-sm text-white/65">الدور الحالي</p>
              <p className="mt-2 text-2xl font-black">{currentTeamName}</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-sm text-white/65">{side2Name}</p>
              <p className="mt-2 text-4xl font-black text-cyan-200">{score2}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-bold md:text-lg">
            {phase === "result"
              ? `طلعت لك: ${formatValue(currentValue)}`
              : phase === "guess"
              ? `اختر حرفًا — قيمة الحرف ${formatValue(currentValue)}`
              : phase === "celebrate"
              ? "🏆 انتهت الجولة!"
              : `الآن: ${currentTeamName} — لف العجلة`}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            {revealedWordGroups.map((word, wordIndex) => (
              <div key={wordIndex} className="flex items-center gap-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {word.map((letter, i) => (
                    <div
                      key={`${wordIndex}-${i}`}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-black shadow-[0_0_10px_rgba(255,255,255,0.04)]"
                    >
                      {letter || ""}
                    </div>
                  ))}
                </div>

                {wordIndex < revealedWordGroups.length - 1 && (
                  <div className="hidden h-10 w-6 items-center justify-center md:flex">
                    <div className="h-1 w-6 rounded-full bg-cyan-300/50" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {revealedWordGroups.length > 1 && (
            <p className="mt-3 text-sm text-white/55">
              الكلمة مكوّنة من {revealedWordGroups.length} كلمات
            </p>
          )}

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
            <div>
              {(phase === "spin" || phase === "result") && (
                <div className="flex flex-col items-center">
                  <div className="relative h-[320px] w-[320px] md:h-[360px] md:w-[360px]">
                    <div
                      className={`absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-2 transition ${
                        wheelGlow
                          ? "scale-110 drop-shadow-[0_0_20px_rgba(248,113,113,0.95)]"
                          : "drop-shadow-[0_0_14px_rgba(248,113,113,0.75)]"
                      }`}
                    >
                      <div className="h-0 w-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-red-500" />
                    </div>

                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,255,255,0.10), transparent 58%)",
                        filter: "blur(8px)",
                      }}
                    />

                    <div
                      className="relative h-full w-full rounded-full border-[6px] border-white/25"
                      style={{
                        background: `conic-gradient(${SEGMENTS.map((s, i) => {
                          const start = i * segmentAngle;
                          const end = (i + 1) * segmentAngle;
                          return `${s.color} ${start}deg ${end}deg`;
                        }).join(", ")})`,
                        transform: `rotate(${rotation}deg)`,
                        transition: "transform 3s cubic-bezier(0.08, 0.9, 0.2, 1)",
                        boxShadow:
                          "inset 0 0 25px rgba(0,0,0,0.35), 0 18px 40px rgba(0,0,0,0.45), 0 0 30px rgba(168,85,247,0.18)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="absolute inset-[10px] rounded-full border border-white/10"
                        style={{
                          boxShadow: "inset 0 0 20px rgba(255,255,255,0.06)",
                        }}
                      />

                      {SEGMENTS.map((segment, i) => {
                        const angle = i * segmentAngle + segmentAngle / 2;
                        const isActive = activeSegmentIndex === i;

                        return (
                          <div
                            key={`${segment.label}-${i}`}
                            className="absolute left-1/2 top-1/2 origin-center"
                            style={{
                              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-116px) rotate(${-angle}deg)`,
                            }}
                          >
                            <div
                              className={`w-24 text-center text-base font-black leading-4 text-white transition ${
                                isActive ? "scale-110" : ""
                              }`}
                              style={{
                                textShadow: isActive
                                  ? "0 0 10px rgba(255,255,255,0.95), 0 2px 4px rgba(0,0,0,0.85)"
                                  : "0 2px 4px rgba(0,0,0,0.85)",
                              }}
                            >
                              {segment.label}
                            </div>
                          </div>
                        );
                      })}

                      <div
                        className={`absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/25 bg-[radial-gradient(circle_at_30%_30%,#b91c1c,#7a001f)] text-2xl transition shadow-[0_0_25px_rgba(239,68,68,0.35)] ${
                          wheelGlow ? "scale-105" : ""
                        }`}
                      >
                        🎡
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={spinWheel}
                    disabled={phase !== "spin" || spinning}
                    className="btn-primary mt-5 min-w-[170px] disabled:opacity-50"
                  >
                    {spinning ? "العجلة تدور..." : "لف العجلة"}
                  </button>
                </div>
              )}

              {phase === "guess" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-yellow-300/20 bg-yellow-400/10 px-4 py-3 text-base font-bold text-yellow-100">
                    اختر حرفًا مناسبًا قبل ما يروح دورك
                  </div>

                  <div className="space-y-2">
                    {LETTER_ROWS.map((row, rowIndex) => (
                      <div
                        key={rowIndex}
                        className={`flex justify-center gap-2 ${
                          rowIndex === 1 ? "mr-5" : rowIndex === 2 ? "mr-10" : ""
                        }`}
                      >
                        {row.split("").map((letter) => {
                          const isUsed = usedLetters.includes(letter);

                          return (
                            <button
                              key={letter}
                              onClick={() => pickLetter(letter)}
                              disabled={isUsed}
                              className={`h-12 min-w-[46px] rounded-xl border px-3 text-base font-bold transition ${
                                isUsed
                                  ? "border-white/5 bg-white/5 text-white/25"
                                  : "border-white/10 bg-white/10 text-white hover:bg-white/20 active:scale-95"
                              }`}
                            >
                              {letter}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button onClick={solveWord} className="btn-primary min-w-[170px]">
                      حل الكلمة
                    </button>
                  </div>
                </div>
              )}

              {phase === "celebrate" && (
                <div className="mt-6">
                  <div className="rounded-3xl border border-yellow-300/40 bg-yellow-400/15 px-6 py-8 shadow-2xl">
                    <p className="text-5xl">🏆</p>
                    <p className="mt-4 text-3xl font-black">{winnerName}</p>
                    <p className="mt-2 text-lg text-white/85">فاز بالجولة!</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-right">
                <p className="text-sm text-white/55">طريقة اللعب</p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-white/85">
                  <li>1. لف العجلة أولًا لتحديد قيمة الحرف.</li>
                  <li>2. إذا طلعت خسارة الدور أو إفلاس ينتقل الدور مباشرة.</li>
                  <li>3. بعد الدوران اختر حرفًا من الكلمة.</li>
                  <li>4. كل حرف صحيح يضيف نفس قيمة العجلة.</li>
                  <li>5. تقدر تختار حل الكلمة كاملة في دورك.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-right">
                <p className="text-sm text-white/55">وضع الجولة</p>
                <p className="mt-2 text-lg font-black">
                  {phase === "spin"
                    ? "لف"
                    : phase === "result"
                    ? "النتيجة"
                    : phase === "guess"
                    ? "اختيار حرف"
                    : "النهاية"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-right">
                <p className="text-sm text-white/55">القيمة الحالية</p>
                <p className="mt-2 text-lg font-black">{formatValue(currentValue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
