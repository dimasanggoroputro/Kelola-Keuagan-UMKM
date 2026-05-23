"use client";

import {
  Coffee, ShoppingBag, CreditCard,
  Coins, Home, Receipt, PlusCircle, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/format";

// Petakan semua alias ke key kanonikal
const CATEGORY_ALIAS = {
  food: "food", makanan: "food", minuman: "food", "f&b": "food",
  shopping: "shopping", belanja: "shopping", operasional: "shopping", "bahan baku": "shopping",
  bills: "bills", listrik: "bills", air: "bills", pulsa: "bills",
  salary: "salary", gaji: "salary", karyawan: "salary",
  rent: "rent", sewa: "rent", toko: "rent",
};

const CATEGORY_MAP = {
  food: {
    Icon: Coffee,
    style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15",
    label: "Kuliner",
  },
  shopping: {
    Icon: ShoppingBag,
    style: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/15",
    label: "Belanja",
  },
  bills: {
    Icon: CreditCard,
    style: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/15",
    label: "Tagihan",
  },
  salary: {
    Icon: Coins,
    style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15",
    label: "Operasional",
  },
  rent: {
    Icon: Home,
    style: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/15",
    label: "Tempat",
  },
  other: {
    Icon: Receipt,
    style: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/15",
    label: "Lainnya",
  },
};

function getCategoryConfig(category) {
  const key = CATEGORY_ALIAS[category?.toLowerCase()] ?? "other";
  const config = CATEGORY_MAP[key] ?? CATEGORY_MAP.other;
  // Override label "Lainnya" dengan nama kategori asli jika tidak dikenal
  return key === "other" && category
    ? { ...config, label: category }
    : config;
}

// ─── Empty State ────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-stone-200 dark:border-zinc-900/60 bg-white/40 dark:bg-zinc-900/10 shadow-3xs">
      <div className="relative mb-4">
        <div className="absolute -inset-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-xs" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-3xs animate-float">
          <Receipt className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
        </div>
      </div>
      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
        Belum Ada Transaksi, Bos
      </h4>
      <p className="mt-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 max-w-[260px] leading-relaxed">
        Kas tokomu hari ini masih kosong. Yuk, catat sesuatu lewat Asisten AI biar langsung rapi pembukuannya!
      </p>
      <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
        <PlusCircle className="h-3 w-3 animate-pulse" />
        <span>jual kopi susu 25rb</span>
      </div>
    </div>
  );
}

// ─── Transaction Row ─────────────────────────────────────────────
function TransactionRow({ tx, onDelete }) {
  const { Icon, style, label } = getCategoryConfig(tx.category);
  const isIncome = tx.type === "income";

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-stone-150/80 dark:border-zinc-900/60 bg-white dark:bg-zinc-900/30 shadow-3xs transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-3xs", style)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-extrabold text-zinc-900 dark:text-white leading-tight">
            {tx.item}
          </span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              {label}
            </span>
            {tx.qty > 1 && (
              <>
                <span className="text-[9px] text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-[9px] font-extrabold text-zinc-400 dark:text-zinc-500">
                  {tx.qty} Pcs
                </span>
              </>
            )}
            <span className="text-[9px] text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500">
              {tx.time || "Hari ini"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        <span className={cn(
          "text-xs font-black tracking-tight",
          isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-800 dark:text-zinc-200"
        )}>
          {isIncome ? "+" : "-"}{formatRupiah(tx.amount)}
        </span>
        <button
          onClick={() => onDelete?.(tx.id)}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 transition-all duration-200 cursor-pointer active:scale-90 shrink-0"
          title="Hapus"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export default function RecentTransactions({ transactions = [], onDeleteTransaction }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-xs font-extrabold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
          Transaksi Terakhir
        </h3>
        {transactions.length > 0 && (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-stone-200/40 dark:border-zinc-800/40">
            {transactions.length} Transaksi
          </span>
        )}
      </div>

      {transactions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2.5">
          {transactions.map((tx) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              onDelete={onDeleteTransaction}
            />
          ))}
        </div>
      )}
    </div>
  );
}