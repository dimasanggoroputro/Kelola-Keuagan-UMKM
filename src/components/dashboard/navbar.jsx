"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Clock, Download } from "lucide-react";

function getGreeting(hour) {
  if (hour >= 5  && hour < 11) return { greeting: "Selamat Pagi",  tagline: "Yuk catat jualan pertama hari ini." };
  if (hour >= 11 && hour < 15) return { greeting: "Selamat Siang",  tagline: "Pantau arus kas tokomu di sini." };
  if (hour >= 15 && hour < 18) return { greeting: "Selamat Sore",   tagline: "Berapa yang laku hari ini?" };
  return                               { greeting: "Selamat Malam",  tagline: "Waktunya rekap hasil jualan." };
}

function formatDateTime(date) {
  const dateStr = date.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "short", year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit",
  });
  return `${dateStr} • ${timeStr}`;
}

/** Return up to 2 uppercase initials from a store name */
function getInitials(name) {
  if (!name) return "AT";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function Navbar({ theme, onToggleTheme, storeName = "", onExport }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const hour = now ? now.getHours() : new Date().getHours();
  const { greeting, tagline } = getGreeting(hour);
  const displayName = storeName || "Toko";

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
        px-4 md:px-6
        py-4
        max-w-none
      ">
        {/* Avatar + greeting */}
        <div className="flex items-center gap-3">
          <div className="relative group shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-50 blur-xs transition duration-300 group-hover:opacity-90" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 border border-white dark:border-zinc-800 text-[11px] font-black text-zinc-800 dark:text-white shadow-xs tracking-tight">
              {getInitials(storeName)}
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-zinc-950" />
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-md font-bold tracking-tight text-zinc-900 dark:text-white leading-tight truncate">
              {greeting},&nbsp;
              <span className="font-extrabold">{displayName}</span>
            </h1>
            <p className="hidden sm:block text-[12px] text-zinc-500 dark:text-zinc-400 font-medium truncate">
              {tagline}
            </p>
            {now && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-0.5 flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                <span className="truncate">{formatDateTime(now)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {/* Export shortcut */}
          {onExport && (
            <button
              onClick={onExport}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-2xs transition-all duration-300 cursor-pointer active:scale-95"
              aria-label="Export Laporan"
            >
              <Download className="h-4 w-4" />
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white shadow-2xs transition-all duration-300 cursor-pointer active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === "dark"
              ? <Sun  className="h-[17px] w-[17px]" />
              : <Moon className="h-[17px] w-[17px]" />
            }
          </button>
        </div>
      </div>
    </header>
  );
}