"use client";

import { useState, useMemo } from "react";
import {
  Coffee,
  ShoppingBag,
  CreditCard,
  Coins,
  Home,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/format";

const CATEGORY_MAP = {
  food: {
    color: "stroke-emerald-500 dark:stroke-emerald-400",
    bg: "bg-emerald-500",
    label: "Kuliner",
    Icon: Coffee,
  },
  shopping: {
    color: "stroke-blue-500 dark:stroke-blue-400",
    bg: "bg-blue-500",
    label: "Belanja",
    Icon: ShoppingBag,
  },
  bills: {
    color: "stroke-purple-500 dark:stroke-purple-400",
    bg: "bg-purple-500",
    label: "Tagihan",
    Icon: CreditCard,
  },
  salary: {
    color: "stroke-amber-500 dark:stroke-amber-400",
    bg: "bg-amber-500",
    label: "Operasional",
    Icon: Coins,
  },
  rent: {
    color: "stroke-indigo-500 dark:stroke-indigo-400",
    bg: "bg-indigo-500",
    label: "Tempat",
    Icon: Home,
  },
  other: {
    color: "stroke-zinc-400 dark:stroke-zinc-500",
    bg: "bg-zinc-400",
    label: "Lainnya",
    Icon: Receipt,
  },
};

export default function CategoryDonutChart({ transactions = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const expenses = useMemo(() => {
    return transactions.filter((t) => t.type === "expense");
  }, [transactions]);

  const { chartData, totalExpense } = useMemo(() => {
    const categoryTotals = {};
    let total = 0;

    expenses.forEach((t) => {
      const cat = t.category || "other";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
      total += t.amount;
    });

    const data = Object.entries(categoryTotals)
      .map(([key, val]) => {
        const config = CATEGORY_MAP[key] ?? CATEGORY_MAP.other;
        return {
          key,
          value: val,
          percentage: total > 0 ? Math.round((val / total) * 100) : 0,
          ...config,
        };
      })
      .sort((a, b) => b.value - a.value); // Sort descending

    return { chartData: data, totalExpense: total };
  }, [expenses]);

  if (totalExpense === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-200 dark:border-zinc-800/60 bg-gradient-to-b from-white/60 to-stone-50/30 dark:from-zinc-900/20 dark:to-zinc-950/10 py-10 px-5 text-center">
        <div className="relative inline-flex mb-4">
          <div
            className="absolute -inset-2 rounded-full bg-purple-500/8 dark:bg-purple-500/5 blur-lg animate-pulse"
            style={{ animationDuration: "5s" }}
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
            <Receipt className="h-6 w-6 text-zinc-300 dark:text-zinc-600" />
          </div>
        </div>
        <h4 className="text-sm font-black text-zinc-800 dark:text-white tracking-tight">
          Belum Ada Pengeluaran
        </h4>
        <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed max-w-[240px] mx-auto">
          Catat pengeluaran toko untuk melihat grafik pembagian kategori
          otomatis.
        </p>
      </div>
    );
  }

  // SVG Geometry
  const R = 38;
  const C = 2 * Math.PI * R; // ~238.76

  let accumulatedValue = 0;

  return (
    <div className="rounded-2xl border border-stone-150 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-5 shadow-3xs">
      <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 mb-4">
        Pembagian Pengeluaran
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* SVG Donut */}
        <div className="relative h-32 w-32 shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r={R}
              className="stroke-stone-100 dark:stroke-zinc-800 fill-none"
              strokeWidth="10"
            />
            {/* Slices */}
            {chartData.map((slice, i) => {
              const ratio = slice.value / totalExpense;
              const strokeLength = ratio * C;
              const rotationOffset = (accumulatedValue / totalExpense) * 360;
              accumulatedValue += slice.value;

              const isHighlighted = activeIndex === null || activeIndex === i;

              return (
                <circle
                  key={slice.key}
                  cx="50"
                  cy="50"
                  r={R}
                  className={cn(
                    "fill-none transition-all duration-300 cursor-pointer",
                    slice.color,
                  )}
                  strokeWidth={isHighlighted ? 12 : 9}
                  strokeDasharray={`${strokeLength} ${C}`}
                  strokeDashoffset={0}
                  transform={`rotate(${rotationOffset} 50 50)`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                />
              );
            })}
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
            {activeIndex !== null ? (
              <>
                <span className="text-xs font-black text-zinc-900 dark:text-white leading-none">
                  {chartData[activeIndex].percentage}%
                </span>
                <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mt-1 truncate max-w-[70px]">
                  {chartData[activeIndex].label}
                </span>
              </>
            ) : (
              <>
                <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
                  Total
                </span>
                <span className="text-[13px] font-black text-zinc-900 dark:text-white leading-none mt-1.5 px-[1px] truncate max-w-[80px]">
                  {formatRupiah(totalExpense)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {chartData.map((slice, i) => {
            const Icon = slice.Icon;
            const isDimmed = activeIndex !== null && activeIndex !== i;

            return (
              <div
                key={slice.key}
                className={cn(
                  "flex items-center justify-between p-1.5 rounded-lg transition-all cursor-pointer hover:bg-stone-50 dark:hover:bg-zinc-800/40 select-none",
                  isDimmed
                    ? "opacity-40 scale-[0.98]"
                    : "opacity-100 scale-100",
                )}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full shrink-0",
                      slice.bg,
                    )}
                  />
                  <Icon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate leading-none">
                    {slice.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <span className="text-[11px] font-bold text-zinc-900 dark:text-white tracking-tight">
                    {formatRupiah(slice.value)}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase min-w-[28px] text-right">
                    {slice.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
