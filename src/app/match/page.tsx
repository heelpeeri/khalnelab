function WordGame({
  onRoundEnd,
}: {
  onRoundEnd: () => void;
}) {
  const WORDS_3 = [
    "بيت", "باب", "بحر", "جمل", "جبل", "حبر", "حلم", "حوت",
    "خيل", "درب", "رمل", "ريح", "زهر", "سهم", "سور", "شمس",
    "صقر", "طير", "عين", "قمر", "قلم", "كلب", "ليل", "مطر",
    "نار", "نجم", "نور", "نهر", "ورد", "وقت",
  ];

  const WORDS_4 = [
    "كتاب", "مكتب", "هاتف", "تفاح", "قطار", "كرسي", "شمعة", "خيمة",
    "سحاب", "نجمة", "مكيف", "قهوة", "طريق", "ملعب", "موزة", "صحن",
    "سرير", "شباك", "حليب", "ورقة", "نخله", "ورده", "سمكه", "بيضه",
    "علبه", "شاحن", "لوحه", "مخده", "منبه", "فرشه", "ساعه", "غرفه",
    "مطبخ", "شارع", "مدرس", "طالب",
  ];

  function getRandomWord() {
    const useFour = Math.random() < 0.7;
    const list = useFour ? WORDS_4 : WORDS_3;
    return list[Math.floor(Math.random() * list.length)];
  }

  const MAX_TRIES = 6;
  const [answer, setAnswer] = useState(getRandomWord);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [keyStatus, setKeyStatus] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

  function normalize(text: string) {
    return text.trim().replace(/\s+/g, "");
  }

  function submitGuess() {
    const guess = normalize(current);

    if (status !== "playing") return;
    if (guess.length !== answer.length) return;
    if (guesses.length >= MAX_TRIES) return;

    const nextGuesses = [...guesses, guess];

    const newStatus = { ...keyStatus };

    guess.split("").forEach((letter, i) => {
      if (answer[i] === letter) {
        newStatus[letter] = "correct";
      } else if (answer.includes(letter)) {
        if (newStatus[letter] !== "correct") {
          newStatus[letter] = "present";
        }
      } else {
        if (!newStatus[letter]) {
          newStatus[letter] = "absent";
        }
      }
    });

    setKeyStatus(newStatus);
    setGuesses(nextGuesses);
    setCurrent("");

    if (guess === answer) {
      setStatus("won");
      return;
    }

    if (nextGuesses.length >= MAX_TRIES) {
      setStatus("lost");
    }
  }

  function getCellColor(letter: string, index: number) {
    if (answer[index] === letter) return "bg-green-500 border-green-500";
    if (answer.includes(letter)) return "bg-yellow-400 border-yellow-400";
    return "bg-gray-400 border-gray-400";
  }

  function resetWordGame() {
    setAnswer(getRandomWord());
    setGuesses([]);
    setCurrent("");
    setKeyStatus({});
    setStatus("playing");
  }

  const emptyRows = MAX_TRIES - guesses.length;

  const keyboardRows = [
    "ضصثقفغعهخحجد",
    "شسيبلاتنمكط",
    "ئءؤرلاىةوزظ",
  ];

  return (
    <GlassCard className="p-6 text-center">
      <h2 className="text-2xl font-black">وشي الكلمة؟</h2>
      <p className="mt-2 text-white/80">خمن الكلمة من {answer.length} حروف</p>

      <div className="mt-6 space-y-2">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {guess.split("").map((letter, colIndex) => (
              <div
                key={colIndex}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg font-black text-white ${getCellColor(letter, colIndex)}`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}

        {Array.from({ length: emptyRows }).map((_, rowIndex) => (
          <div key={`empty-${rowIndex}`} className="flex justify-center gap-2">
            {Array.from({ length: answer.length }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-lg font-black text-white"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <input
          type="text"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder={`اكتب كلمة من ${answer.length} حروف`}
          className="w-full max-w-sm rounded-2xl border border-white/20 bg-white px-4 py-3 text-center text-2xl font-black text-black outline-none"
        />

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={submitGuess}
            disabled={status !== "playing"}
            className="btn-primary disabled:opacity-50"
          >
            تأكيد
          </button>

          <button
            type="button"
            onClick={resetWordGame}
            className="btn-secondary"
          >
            كلمة جديدة
          </button>

          <button
            type="button"
            onClick={onRoundEnd}
            disabled={status === "playing"}
            className="btn-primary disabled:opacity-50"
          >
            إنهاء الجولة
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {keyboardRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-wrap justify-center gap-2"
          >
            {row.split("").map((key) => {
              const keyColor = keyStatus[key];

              let color = "bg-white/10";
              if (keyColor === "correct") color = "bg-green-500";
              if (keyColor === "present") color = "bg-yellow-400";
              if (keyColor === "absent") color = "bg-gray-400";

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (current.length < answer.length) {
                      setCurrent((prev) => prev + key);
                    }
                  }}
                  className={`h-11 min-w-[42px] rounded-xl px-3 text-sm font-bold text-white transition active:scale-95 ${color}`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}

        <div className="mt-3 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrent((prev) => prev.slice(0, -1))}
            className="btn-secondary min-w-[100px]"
          >
            حذف ⌫
          </button>

          <button
            type="button"
            onClick={submitGuess}
            disabled={status !== "playing"}
            className="btn-primary min-w-[100px] disabled:opacity-50"
          >
            إدخال
          </button>
        </div>
      </div>

      {status === "won" && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4">
          <p className="text-lg font-black">🔥 ممتاز! عرفت الكلمة</p>
        </div>
      )}

      {status === "lost" && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4">
          <p className="text-lg font-black">انتهت المحاولات</p>
          <p className="mt-2 text-white/80">الكلمة الصحيحة: {answer}</p>
        </div>
      )}
    </GlassCard>
  );
}
