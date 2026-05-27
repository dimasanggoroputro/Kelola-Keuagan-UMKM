"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "food",     label: "Kuliner" },
  { id: "shopping", label: "Belanja" },
  { id: "bills",    label: "Tagihan" },
  { id: "salary",   label: "Operasional" },
  { id: "rent",     label: "Tempat" },
  { id: "other",    label: "Lainnya" },
];

// Formatter for rupiah input (separator dot, e.g. "1.500.000")
const formatNumberString = (value) => {
  if (value === undefined || value === null || value === "") return "";
  const clean = value.toString().replace(/\D/g, "");
  if (!clean) return "";
  return new Intl.NumberFormat("id-ID").format(Number(clean));
};

const parseNumberString = (formattedValue) => {
  if (formattedValue === undefined || formattedValue === null || formattedValue === "") return "";
  return formattedValue.toString().replace(/\D/g, "");
};

export default function EditTransactionModal({ tx, onSave, onClose }) {
  const [form, setForm] = useState({
    item:     tx?.item     ?? "",
    amount:   tx?.amount   ?? "",
    category: tx?.category ?? "other",
    type:     tx?.type     ?? "expense",
    qty:      tx?.qty      ?? 1,
    unit:     tx?.unit     ?? "",
  });

  if (!tx) return null;

  const canSave = form.item.trim().length > 0 && Number(form.amount) > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave(tx.id, {
      ...form,
      amount: Number(form.amount),
      qty:    Number(form.qty) || 1,
      unit:   form.unit.trim() || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up">
        {/* Handle (mobile only) */}
        <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700 mx-auto mb-5 sm:hidden" />

        {/* Title row */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
            Edit Transaksi
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex gap-2 mb-4">
          {[
            ["income",  "Pemasukan"],
            ["expense", "Pengeluaran"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setForm((f) => ({ ...f, type: val }))}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer active:scale-[0.97]",
                form.type === val
                  ? val === "income"
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Item name */}
        <label className="block mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-zinc-400 mb-1.5 block">
            Nama Item
          </span>
          <input
            value={form.item}
            onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))}
            placeholder="Nama barang atau keterangan"
            className="w-full rounded-xl border border-stone-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </label>

        {/* Amount */}
        <label className="block mb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-zinc-400 mb-1.5 block">
            Jumlah (Rp)
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={formatNumberString(form.amount)}
            onChange={(e) => {
              const parsed = parseNumberString(e.target.value);
              setForm((f) => ({ ...f, amount: parsed }));
            }}
            placeholder="0"
            className="w-full rounded-xl border border-stone-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </label>

        {/* Category */}
        <div className="mb-5">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-zinc-400 mb-1.5 block">
            Kategori
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setForm((f) => ({ ...f, category: id }))}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-extrabold border transition-all cursor-pointer active:scale-95",
                  form.category === id
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-zinc-50 dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 text-zinc-500",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2",
            canSave
              ? "bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer active:scale-[0.98]"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed",
          )}
        >
          <Check className="h-4 w-4" />
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
