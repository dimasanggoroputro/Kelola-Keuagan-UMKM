"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/dashboard/navbar";
import StatsCard from "@/components/dashboard/stats-card";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import AIAssistant from "@/components/dashboard/ai-assistant";
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  BrainCircuit,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/format";
import { Toaster, toast } from "sonner";

const initialSampleTransactions = [
  {
    id: "tx-1",
    type: "income",
    item: "Nasi Goreng Spesial",
    qty: 5,
    amount: 100000,
    category: "food",
    time: "09:15",
  },
  {
    id: "tx-2",
    type: "expense",
    item: "Bahan Baku & Telur",
    qty: 1,
    amount: 45000,
    category: "shopping",
    time: "10:30",
  },
  {
    id: "tx-3",
    type: "income",
    item: "Es Kopi Susu Aren",
    qty: 2,
    amount: 30000,
    category: "food",
    time: "11:45",
  },
];

// ─── Desktop Sidebar ──────────────────────────────────────────────
function DesktopSidebar({ activeTab, onTabChange, onReset, onClearChat }) {
  const navItems = [
    { id: "chat", label: "Asisten AI", Icon: Sparkles },
    { id: "kas", label: "Buku Kas", Icon: BarChart3 },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-52 shrink-0 border-r border-stone-200/50 dark:border-zinc-800/60 bg-[#FAF9F6] dark:bg-[#0C0C0B] py-4 px-3 gap-1">
      <p className="text-[10px] font-extrabold tracking-widest uppercase text-zinc-400 dark:text-zinc-600 px-2 mb-2">
        Menu
      </p>

      {navItems.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer w-full text-left",
            activeTab === id
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
              : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border border-transparent",
          )}
        >
          <Icon
            className={cn("h-4 w-4", activeTab === id && "text-emerald-500")}
          />
          {label}
        </button>
      ))}

      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-stone-200/50 dark:border-zinc-800/60">
        <p className="text-[10px] font-extrabold tracking-widest uppercase text-zinc-400 dark:text-zinc-600 px-2 mb-1">
          Aksi
        </p>
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 border border-transparent transition-all duration-200 cursor-pointer w-full text-left"
        >
          <RefreshCw className="h-4 w-4" />
          Reset Data
        </button>
        <button
          onClick={onClearChat}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border border-transparent transition-all duration-200 cursor-pointer w-full text-left"
        >
          <Trash2 className="h-4 w-4" />
          Hapus Chat
        </button>
      </div>
    </aside>
  );
}

// ─── Kas Panel (reusable di desktop kanan + mobile tab) ───────────
function KasPanel({
  transactions,
  totalIncome,
  totalExpense,
  totalProfit,
  onDeleteTransaction,
}) {
  const aiInsights = buildInsights(
    totalIncome,
    totalExpense,
    totalProfit,
    transactions,
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">
      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Arus Kas Toko
          </h3>
          <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </div>
        </div>
        <div className="flex overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory lg:snap-none gap-3.5 pb-3 -mx-4 lg:mx-0 px-4 lg:px-0 scrollbar-none lg:grid lg:grid-cols-3">
          <StatsCard
            title="Pemasukan Toko"
            value={totalIncome}
            description="Uang masuk dari penjualan."
            type="income"
          />
          <StatsCard
            title="Pengeluaran"
            value={totalExpense}
            description="Uang keluar operasional."
            type="expense"
          />
          <StatsCard
            title="Untung Bersih"
            value={totalProfit}
            description="Sisa keuntungan bersih."
            type="profit"
          />
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
          <BrainCircuit className="h-3.5 w-3.5 text-indigo-500" />
          Analisis Keuangan AI
        </h3>
        {aiInsights.length === 0 ? (
          <div className="p-5 rounded-2xl border border-dashed border-stone-200 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/10 flex flex-col items-center justify-center text-center">
            <BrainCircuit className="h-5 w-5 text-zinc-400 dark:text-zinc-600 mb-3" />
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
              Analisis Belum Tersedia
            </h4>
            <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium max-w-[240px]">
              Catat beberapa transaksi agar AI dapat menganalisis kinerja bisnis
              Bos.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-150 dark:border-zinc-900/60 bg-white dark:bg-zinc-900/40 p-4 space-y-3">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-stone-50 dark:bg-zinc-900 border border-stone-150 dark:border-zinc-800 shrink-0 mt-0.5">
                  {insight.icon}
                </div>
                <p
                  className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: insight.text.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="font-extrabold text-zinc-900 dark:text-white">$1</strong>',
                    ),
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <RecentTransactions
        transactions={transactions}
        onDeleteTransaction={onDeleteTransaction}
      />
    </div>
  );
}

// ─── Pure function: AI insights ───────────────────────────────────
function buildInsights(totalIncome, totalExpense, totalProfit, transactions) {
  if (transactions.length === 0) return [];

  const insights = [];
  const foodSales = transactions
    .filter((tx) => tx.type === "income" && tx.category === "food")
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (foodSales > 0) {
    insights.push({
      id: "ins-1",
      text: `Pemasukan utama dari kategori **Makanan & Minuman** senilai **${formatRupiah(foodSales)}**.`,
      icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
    });
  }
  if (totalExpense > 0) {
    insights.push({
      id: "ins-2",
      text: `Belanja operasional **${formatRupiah(totalExpense)}** masih dalam batas wajar.`,
      icon: <BarChart3 className="h-4 w-4 text-blue-500" />,
    });
  }
  if (totalIncome > 0 && totalProfit > 0) {
    const margin = Math.round((totalProfit / totalIncome) * 100);
    insights.push({
      id: "ins-3",
      text: `Margin keuntungan bersih **${margin}%** — kondisi keuangan **Sangat Sehat**!`,
      icon: <Sparkles className="h-4 w-4 text-violet-500" />,
    });
  }
  return insights;
}

// ─── Page ─────────────────────────────────────────────────────────
export default function Home() {
  const [transactions, setTransactions] = useState(initialSampleTransactions);
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  // Ref untuk trigger clear chat dari sidebar desktop
  const [clearChatSignal, setClearChatSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("catetin-theme") || "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("catetin-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    toast.success("Catatan berhasil disimpan", {
      description: `${newTx.type === "income" ? "Pemasukan" : "Pengeluaran"}: ${newTx.item} (${formatRupiah(newTx.amount)})`,
    });
  };

  const handleDeleteTransaction = (id) => {
    const tx = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    if (tx)
      toast.error("Transaksi dihapus", {
        description: `${tx.item} telah dikeluarkan dari kas.`,
      });
  };

  const handleClearTransactions = () => {
    setTransactions([]);
    toast.info("Buku Kas berhasil dikosongkan");
  };

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((s, tx) => s + tx.amount, 0);
  const totalExpense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((s, tx) => s + tx.amount, 0);
  const totalProfit = totalIncome - totalExpense;

  if (!mounted) return <div className="min-h-screen bg-zinc-950" />;

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-[#0C0C0B] transition-colors duration-300 font-sans">
      <Toaster position="top-center" richColors theme={theme === "dark" ? "dark" : "light"} />
      <Navbar theme={theme} onToggleTheme={toggleTheme} activeTab={activeTab} />

      {/* ── Mobile & Tablet (<1024px): full-width, bottom nav ── */}
      <div className="lg:hidden flex flex-col h-screen fixed inset-0 pb-[68px] pt-[72px] overflow-hidden">
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <AIAssistant
              onAddTransaction={handleAddTransaction}
              onClearTransactions={handleClearTransactions}
              inline
              clearSignal={clearChatSignal}
              resetSignal={resetSignal}
            />
          </div>
        )}

        {activeTab === "kas" && (
          <KasPanel
            transactions={transactions}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            totalProfit={totalProfit}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/90 dark:bg-[#0E0E0E]/90 border-t border-stone-200/50 dark:border-zinc-800/60 px-8 py-3.5 flex items-center justify-around">
          {[
            { id: "chat", label: "Asisten AI", Icon: Sparkles },
            { id: "kas", label: "Buku Kas", Icon: BarChart3 },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 active:scale-90",
                activeTab === id
                  ? "text-emerald-600 dark:text-emerald-400 font-extrabold scale-105"
                  : "text-zinc-400 dark:text-zinc-500 font-bold"
              )}
            >
              <Icon className={cn("h-5 w-5", activeTab === id && "animate-pulse")} />
              <span className="text-[10px] tracking-wide font-extrabold">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop (≥1024px): sidebar kiri + konten ── */}
      <div className="hidden lg:flex h-screen pt-[72px]">
        <DesktopSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onReset={() => {
            if (confirm("Reset seluruh data transaksi?")) {
              handleClearTransactions();
              setResetSignal((s) => s + 1);
            }
          }}
          onClearChat={() => {
            if (confirm("Hapus seluruh percakapan asisten?")) {
              setClearChatSignal((s) => s + 1);
            }
          }}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className={cn(
            "flex flex-col border-r border-stone-200/50 dark:border-zinc-800/60 transition-all duration-300",
            activeTab === "kas" ? "w-0 overflow-hidden opacity-0" : "flex-1"
          )}>
            <AIAssistant
              onAddTransaction={handleAddTransaction}
              onClearTransactions={handleClearTransactions}
              inline
              clearSignal={clearChatSignal}
              resetSignal={resetSignal}
            />
          </div>

          <div className={cn(
            "flex flex-col overflow-hidden transition-all duration-300",
            activeTab === "chat" ? "w-0 overflow-hidden opacity-0" : "flex-1"
          )}>
            <KasPanel
              transactions={transactions}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              totalProfit={totalProfit}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
