"use client";

import { useState } from "react";
import { LogIn, User, Sparkles, X, Check } from "lucide-react";
import { signInWithGoogle } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function LoginModal({ isOpen, onClose, onContinueAsGuest, isMigrating }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      console.error("Google Sign-in Error:", err);
      setError("Gagal masuk dengan Google. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <LogIn className="h-5 w-5" />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Info */}
        <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white leading-tight">
          {isMigrating ? "Amankan Data Keuanganmu" : "Masuk ke Catetin AI"}
        </h2>
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-6 leading-relaxed">
          {isMigrating
            ? "Tautkan akun Guest kamu ke Google agar catatan keuangan aman, bisa diakses di perangkat lain, dan tidak hilang saat browser dibersihkan."
            : "Simpan riwayat transaksi tokomu secara permanen dan pantau arus kas dari mana saja."}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold transition-all bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] border border-transparent shadow-xs"
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <>
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.706 0 3.277.61 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.254-4.074 10.254-10.24 0-.695-.08-1.355-.22-1.955H12.24z" />
                </svg>
                Masuk dengan Google
              </>
            )}
          </button>

          {onContinueAsGuest && (
            <button
              onClick={onContinueAsGuest}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold transition-all bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] border border-stone-200/50 dark:border-zinc-700/50"
            >
              <User className="h-3.5 w-3.5" />
              Lanjutkan Tanpa Login (Guest)
            </button>
          )}
        </div>

        {/* Footnote */}
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-zinc-800/80 flex items-center gap-2 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider justify-center">
          <Sparkles className="h-3 w-3 text-emerald-500 animate-pulse" />
          <span>Bebas Biaya & Otomatis</span>
        </div>
      </div>
    </div>
  );
}
