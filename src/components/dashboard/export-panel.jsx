"use client";

import { useState } from "react";
import { X, Copy, Check, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/format";

const PERIOD_LABELS = {
  today: "Hari Ini",
  week: "Minggu Ini",
  month: "Bulan Ini",
  all: "Semua Waktu",
};

function buildSummary({
  transactions,
  totalIncome,
  totalExpense,
  totalProfit,
  period,
  storeName,
}) {
  const label = PERIOD_LABELS[period] ?? "Semua";
  const date = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Top 3 income
  const topIncome = [...transactions]
    .filter((t) => t.type === "income")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Top 3 expense
  const topExpense = [...transactions]
    .filter((t) => t.type === "expense")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Last 5 transactions
  const lastTransactions = [...transactions].slice(-5).reverse(); // urut dari terbaru

  const margin =
    totalIncome > 0 ? Math.round((totalProfit / totalIncome) * 100) : 0;

  let text = `LAPORAN KEUANGAN${
    storeName ? " – " + storeName.toUpperCase() : ""
  }\n`;
  text += `Periode : ${label}  •  ${date}\n`;
  text += `Dibuat via Catetin AI\n`;
  text += `${"─".repeat(34)}\n\n`;

  text += `RINGKASAN\n`;
  text += `Pemasukan    : ${formatRupiah(totalIncome)}\n`;
  text += `Pengeluaran  : ${formatRupiah(totalExpense)}\n`;
  text += `Untung Bersih: ${formatRupiah(totalProfit)} (${margin}%)\n`;
  text += `Total Catatan: ${transactions.length} transaksi\n`;

  if (topIncome.length > 0) {
    text += `\nPEMASUKAN TERBESAR\n`;
    topIncome.forEach((t, i) => {
      text += `${i + 1}. ${t.item} — ${formatRupiah(t.amount)}\n`;
    });
  }

  if (topExpense.length > 0) {
    text += `\nPENGELUARAN TERBESAR\n`;
    topExpense.forEach((t, i) => {
      text += `${i + 1}. ${t.item} — ${formatRupiah(t.amount)}\n`;
    });
  }

  if (lastTransactions.length > 0) {
    text += `\nTRANSAKSI TERAKHIR\n`;
    lastTransactions.forEach((t) => {
      const qtyText = t.qty > 1 ? `${t.qty}${t.unit ? " " + t.unit : ""} ` : "";
      text += `- ${t.type === "income" ? "Terjual" : "Beli"} ${t.item} ${qtyText}${formatRupiah(t.amount)}\n`;
    });
  }

  return text;
}

export default function ExportPanel({
  transactions,
  totalIncome,
  totalExpense,
  totalProfit,
  period,
  storeName,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  const text = buildSummary({
    transactions,
    totalIncome,
    totalExpense,
    totalProfit,
    period,
    storeName,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700 mx-auto mt-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
              Export Laporan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4 mb-4 max-h-60 overflow-y-auto">
            <pre className="text-[11px] text-zinc-700 dark:text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
              {text}
            </pre>
          </div>

          <button
            onClick={handleCopy}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]",
              copied
                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-emerald-500 hover:bg-emerald-600 text-white",
            )}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Tersalin!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Salin Teks
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 mt-2.5 font-medium">
            Paste ke WhatsApp, Notes, atau email kapanpun.
          </p>
        </div>
      </div>
    </div>
  );
}
