"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Sparkles, Clock } from "lucide-react";

function getGreeting(hour) {
  if (hour >= 5 && hour < 11) return {
    greeting: "Pagi, Bos! Rejeki Lancar",
    tagline: "Yuk catat jualan pertamamu hari ini!",
  };
  if (hour >= 11 && hour < 15) return {
    greeting: "Siang, Bos! Semangat Terus",
    tagline: "Laris manis! Pantau arus kas tokomu di sini.",
  };
  if (hour >= 15 && hour < 18) return {
    greeting: "Sore, Bos! Usaha Lancar",
    tagline: "Berapa piring/pcs yang laku hari ini?",
  };
  return {
    greeting: "Malam, Bos! Waktunya Santai",
    tagline: "Yuk rekap hasil jualan larismu hari ini!",
  };
}

function formatDateTime(date) {
  const dateStr = date.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric",
    month: "short", year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit",
  });
  return `${dateStr} • ${timeStr}`;
}

export default function Navbar({ theme, onToggleTheme }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const { greeting, tagline } = getGreeting(now ? now.getHours() : new Date().getHours());

  return (
    <header className="
      fixed top-0 left-0 right-0 z-40
      backdrop-blur-md
      bg-[#FAF9F6]/90 dark:bg-[#0C0C0B]/90
      border-b border-stone-200/50 dark:border-zinc-800/60
      transition-all duration-300
    ">
      <div className="
        flex items-center justify-between
        px-5 md:px-8 lg:px-6
        py-3 md:py-3.5
        max-w-none
      ">
        {/* Avatar + Greeting */}
        <div className="flex items-center gap-3">
          <div className="relative group shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60 blur-xs transition duration-300 group-hover:opacity-100" />
            <div className="relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 border border-white dark:border-zinc-800 text-sm font-semibold text-zinc-800 dark:text-white shadow-xs">
              UM
            </div>
            <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-zinc-950" />
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm md:text-base font-bold tracking-tight text-zinc-900 dark:text-white leading-tight truncate">
              {greeting}
            </h1>
            {/* Tagline — sembunyikan di mobile kecil supaya tidak overflow */}
            <p className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate">
              {tagline}
            </p>
            {now && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-0.5 flex items-center gap-1">
                <Clock className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="truncate">{formatDateTime(now)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white shadow-2xs transition-all duration-300 cursor-pointer active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === "dark"
              ? <Sun className="h-[18px] w-[18px]" />
              : <Moon className="h-[18px] w-[18px]" />
            }
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/10 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse shrink-0" />
            <span className="text-[10px] font-bold tracking-wider uppercase hidden sm:inline">AI Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}