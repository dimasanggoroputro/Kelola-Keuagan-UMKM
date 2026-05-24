"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/format";

const STYLE_MAP = {
  income: {
    Icon:  ArrowDownLeft,
    accent: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
    text:   "text-emerald-600 dark:text-emerald-400",
    glow:   "group-hover:border-emerald-500/30 group-hover:shadow-emerald-500/5",
  },
  expense: {
    Icon:  ArrowUpRight,
    accent: "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20",
    text:   "text-rose-600 dark:text-rose-400",
    glow:   "group-hover:border-rose-500/30 group-hover:shadow-rose-500/5",
  },
  profit: {
    Icon:  TrendingUp,
    accent: "bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-500/20",
    text:   "text-violet-600 dark:text-violet-400",
    glow:   "group-hover:border-violet-500/30 group-hover:shadow-violet-500/5",
  },
};

// ── Animated count-up hook ─────────────────────────────────────────
function useCountUp(target, duration = 550) {
  const [display, setDisplay] = useState(target);
  const rafRef  = useRef(null);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = target;

    // Skip animation if value didn't change
    if (from === target) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const startTs = { current: null };

    const tick = (ts) => {
      if (!startTs.current) startTs.current = ts;
      const progress = Math.min((ts - startTs.current) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}

// ── Component ─────────────────────────────────────────────────────
export default function StatsCard({ title, value, description, type = "income" }) {
  const { Icon, accent, text, glow } = STYLE_MAP[type] ?? STYLE_MAP.profit;
  const animated = useCountUp(value);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-stone-150 dark:border-zinc-800/80",
        "bg-white dark:bg-zinc-900 p-5 shadow-3xs transition-all duration-300",
        "active:scale-[0.97] cursor-pointer select-none",
        "w-[76vw] sm:w-[280px] lg:w-full shrink-0 snap-center snap-always",
        glow,
      )}
    >
      {/* Title + icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
          {title}
        </span>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl border shadow-3xs", accent)}>
          <Icon className={cn("h-5 w-5", text)} />
        </div>
      </div>

      {/* Animated value */}
      <div className="mt-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-none font-sans tabular-nums">
          {formatRupiah(animated)}
        </h2>
        {description && (
          <p className="mt-2.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
            {description}
          </p>
        )}
      </div>

      {/* Decorative radial */}
      <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-radial from-current/5 to-transparent pointer-events-none" />
    </div>
  );
}