"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";
import { getNickname, makeRoomId, saveNickname, type GameType } from "@/lib/storage";

const gameTitle: Record<GameType, string> = {
  word: "وشي الكلمة؟",
  draw: "وشي الرسمة؟",
  categories: "إنسان حيوان نبات جماد",
};

export default function NicknamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");

  const game = useMemo<GameType>(() => {
    const value = searchParams.get("game");
    if (value === "draw" || value === "categories" || value === "word") return value;
    return "word";
  }, [searchParams]);

  useEffect(() => {
    setName(getNickname());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    saveNickname(name.trim());
    const roomId = makeRoomId();
    router.push(`/room/${roomId}?game=${game}&name=${encodeURIComponent(name.trim())}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <GlassCard className="w-full max-w-xl p-8 text-center">
        <Logo size={120} />
        <p className="mt-4 text-sm text-white/70">اللعبة المختارة</p>
        <h1 className="mt-2 text-3xl font-black">{gameTitle[game]}</h1>
        <p className="mt-3 text-white/80">اكتب اسمًا مستعارًا ثم أنشئ غرفة جديدة.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسمك المستعار"
            className="input"
          />
          <button type="submit" className="btn-primary w-full">
            إنشاء غرفة
          </button>
        </form>
      </GlassCard>
    </main>
  );
}