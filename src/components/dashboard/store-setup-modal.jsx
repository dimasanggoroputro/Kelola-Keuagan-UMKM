"use client";

import { useState } from "react";
import { Store, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StoreSetupModal({ onComplete, initialValue = "", onClose }) {
  const [name, setName] = useState(initialValue);

  const handle = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("catetin-store-name", trimmed);
    onComplete(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl animate-slide-up relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <Store className="h-5 w-5 text-emerald-500" />
        </div>

        <h2 className="text-base font-extrabold text-zinc-900 dark:text-white leading-tight">
          {initialValue ? "Ubah Nama Usaha" : "Nama Usaha Kamu"}
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-5 leading-relaxed">
          {initialValue ? "Masukkan nama baru untuk usaha Toko Bos." : "Masukkan nama toko atau usaha supaya tampilan lebih personal."}
        </p>

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handle()}
          placeholder="cth: Warung Bahagia"
          maxLength={30}
          className="w-full rounded-xl border border-stone-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500/50 transition-colors mb-4"
        />

        <button
          onClick={handle}
          disabled={!name.trim()}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-extrabold transition-all",
            name.trim()
              ? "bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer active:scale-[0.98]"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed",
          )}
        >
          {initialValue ? "Simpan Perubahan" : "Mulai Catat"}
        </button>
      </div>
    </div>
  );
}
