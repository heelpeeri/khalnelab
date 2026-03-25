'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type SearchParams = Promise<{
  game?: string;
}>;

function NicknameForm({ game }: { game: string }) {
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('nickname');
    if (saved) setName(saved);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    localStorage.setItem('nickname', name);
    router.push(`/room/demo?player=${encodeURIComponent(name)}&game=${game}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-500 via-red-600 to-pink-500 px-4 text-white">
      <div className="w-full max-w-md rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-xl">
        <img src="/logo.png" alt="خل نلعب" className="mx-auto mb-6 w-28" />

        <h1 className="mb-3 text-3xl font-black">اختر اسمك</h1>
        <p className="mb-6 text-sm text-white/80">أدخل اسمًا مستعارًا للعب</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: أبو فيصل"
            className="w-full rounded-2xl border border-white/20 bg-white/20 px-4 py-3 text-white outline-none placeholder:text-white/60"
          />

          <button className="w-full rounded-2xl bg-white px-5 py-3 font-bold text-red-500 transition hover:scale-105">
            متابعة
          </button>
        </form>
      </div>
    </main>
  );
}

export default async function NicknamePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const game = params?.game || 'word';

  return <NicknameForm game={game} />;
}
