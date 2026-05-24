"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

// Indonesian short weekday names
const DAYS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function getLast7Days(transactions) {
  const result = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const dayTx = transactions.filter((tx) => {
      const t = new Date(tx.createdAt);
      return t >= dayStart && t < dayEnd;
    });

    result.push({
      label: DAYS_ID[dayStart.getDay()],
      income: dayTx
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
      expense: dayTx
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
      isToday: i === 0,
    });
  }

  return result;
}

export default function SparklineChart({ transactions = [] }) {
  const data = useMemo(() => getLast7Days(transactions), [transactions]);

  const hasData = data.some((d) => d.income > 0 || d.expense > 0);
  if (!hasData) return null;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income, d.expense)),
    1,
  );
  const BAR_H = 44;

  return (
    <div className="rounded-2xl border border-stone-150 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 px-4 pt-3.5 pb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-extrabold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
          Tren 7 Hari
        </h3>
        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 dark:text-zinc-500">
            <span className="h-1.5 w-3.5 rounded-full bg-emerald-400" />
            Masuk
          </span>
          <span className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 dark:text-zinc-500">
            <span className="h-1.5 w-3.5 rounded-full bg-rose-400" />
            Keluar
          </span>
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end justify-between gap-1">
        {data.map((d, i) => {
          const incH = maxVal > 0 ? (d.income / maxVal) * BAR_H : 0;
          const expH = maxVal > 0 ? (d.expense / maxVal) * BAR_H : 0;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              {/* Bar pair */}
              <div
                className="flex items-end justify-center gap-[3px]"
                style={{ height: BAR_H }}
              >
                {/* Income bar */}
                <div
                  className={cn(
                    "w-[5px] rounded-t-sm transition-all duration-700 ease-out",
                    d.income > 0
                      ? d.isToday
                        ? "bg-emerald-500"
                        : "bg-emerald-400/65 dark:bg-emerald-500/50"
                      : "bg-zinc-100 dark:bg-zinc-800",
                  )}
                  style={{
                    height: Math.max(d.income > 0 ? incH : 2, 2),
                  }}
                />
                {/* Expense bar */}
                <div
                  className={cn(
                    "w-[5px] rounded-t-sm transition-all duration-700 ease-out",
                    d.expense > 0
                      ? d.isToday
                        ? "bg-rose-500"
                        : "bg-rose-400/65 dark:bg-rose-500/50"
                      : "bg-zinc-100 dark:bg-zinc-800",
                  )}
                  style={{
                    height: Math.max(d.expense > 0 ? expH : 2, 2),
                  }}
                />
              </div>

              {/* Day label */}
              <span
                className={cn(
                  "text-[8px] font-bold",
                  d.isToday
                    ? "text-emerald-500 font-extrabold"
                    : "text-zinc-400 dark:text-zinc-600",
                )}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
