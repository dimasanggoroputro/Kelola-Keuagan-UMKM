"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/dashboard/navbar";
import StatsCard from "@/components/dashboard/stats-card";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import AIAssistant from "@/components/dashboard/ai-assistant";
import SparklineChart from "@/components/dashboard/sparkline-chart";
import EditTransactionModal from "@/components/dashboard/edit-transaction-modal";
import StoreSetupModal from "@/components/dashboard/store-setup-modal";
import ExportPanel from "@/components/dashboard/export-panel";
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  BrainCircuit,
  RefreshCw,
  Trash2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/format";
import { Toaster, toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { getGuestId } from "@/lib/guest-id";

// ─── Supabase field mapping ────────────────────────────────────────
// DB  : id, type, item_name, category, amount, qty, unit, created_at
// App : id, type, item,      category, amount, qty, unit, time
function dbToApp(row) {
  return {
    id: row.id,
    type: row.type,
    item: row.item_name,
    category: row.category ?? "other",
    amount: row.amount,
    qty: row.qty ?? 1,
    unit: row.unit ?? null,
    createdAt: row.created_at, // Preserve for analysis/filtering
    time: new Date(row.created_at).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function appToDb(tx) {
  return {
    type: tx.type,
    item_name: tx.item,
    category: tx.category ?? "other",
    amount: tx.amount,
    qty: tx.qty ?? 1,
    unit: tx.unit ?? null,
  };
}

// ─── Desktop Sidebar ──────────────────────────────────────────────
function DesktopSidebar({ activeTab, onTabChange, onReset, onClearChat }) {
  const navItems = [
    { id: "kas", label: "Buku Kas", Icon: BarChart3 },
    { id: "chat", label: "Asisten AI", Icon: Sparkles },
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
  allTransactions,
  loading = false,
  totalIncome,
  totalExpense,
  totalProfit,
  onDeleteTransaction,
  onEditTransaction,
  activePeriod,
  onPeriodChange,
  onExport,
  newestId,
}) {
  const aiInsights = buildInsights(
    totalIncome,
    totalExpense,
    totalProfit,
    transactions,
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">
      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-3 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-900"
              />
            ))}
          </div>
          <div className="h-3 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800 mt-4" />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900"
            />
          ))}
        </div>
      )}

      {!loading && (
        <>
          {/* Period Filter & Export mobile */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1 p-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/60 border border-stone-200/40 dark:border-zinc-800/40 w-fit shrink-0">
              {[
                { id: "today", label: "Hari Ini" },
                { id: "week", label: "Minggu" },
                { id: "month", label: "Bulan" },
                { id: "all", label: "Semua" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => onPeriodChange(id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer active:scale-95",
                    activePeriod === id
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-3xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {onExport && (
              <button
                onClick={onExport}
                className="flex md:hidden h-8 px-3 items-center justify-center gap-1.5 rounded-xl border border-stone-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 text-xs font-bold shadow-3xs cursor-pointer active:scale-95 transition-all"
              >
                <Download className="h-3.5 w-3.5 text-emerald-500" />
                Laporan
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                Arus Kas Toko
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase">
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

          {/* Sparkline Chart */}
          <SparklineChart transactions={allTransactions} />

          {/* AI Insights */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5 text-indigo-500" />
              Analisis Keuangan AI
            </h3>
            {aiInsights.length === 0 ? (
              <div className="p-5 rounded-2xl border border-dashed border-stone-200 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/10 flex flex-col items-center justify-center text-center">
                <BrainCircuit className="h-5 w-5 text-zinc-400 dark:text-zinc-600 mb-3" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Analisis Belum Tersedia
                </h4>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium max-w-[240px]">
                  Catat beberapa transaksi agar AI dapat menganalisis kinerja
                  bisnis Bos.
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
                      className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed"
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
            onEditTransaction={onEditTransaction}
            newestId={newestId}
          />
        </>
      )}
    </div>
  );
}

// ─── Pure function: AI insights ───────────────────────────────────
function buildInsights(totalIncome, totalExpense, totalProfit, transactions) {
  if (transactions.length === 0) return [];

  const insights = [];

  // 1. Calculate top category by income
  const categoryIncomes = {};
  transactions
    .filter((tx) => tx.type === "income")
    .forEach((tx) => {
      categoryIncomes[tx.category] =
        (categoryIncomes[tx.category] || 0) + tx.amount;
    });

  let topCategory = null;
  let maxIncome = 0;
  Object.entries(categoryIncomes).forEach(([cat, val]) => {
    if (val > maxIncome) {
      maxIncome = val;
      topCategory = cat;
    }
  });

  const categoryLabels = {
    food: "Kuliner",
    shopping: "Belanja",
    bills: "Tagihan",
    salary: "Operasional",
    rent: "Tempat",
    other: "Lainnya",
  };

  if (topCategory && maxIncome > 0) {
    const label = categoryLabels[topCategory] || topCategory;
    insights.push({
      id: "ins-top-cat",
      text: `Pilar penjualan utama toko Bos berasal dari kategori **${label}** sebesar **${formatRupiah(maxIncome)}**.`,
      icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
    });
  }

  // 2. Average transaction size
  const incomes = transactions.filter((tx) => tx.type === "income");
  if (incomes.length > 0) {
    const avgIncome = Math.round(
      incomes.reduce((s, tx) => s + tx.amount, 0) / incomes.length,
    );
    insights.push({
      id: "ins-avg-tx",
      text: `Rata-rata pemasukan per transaksi toko Bos adalah **${formatRupiah(avgIncome)}** dari total **${incomes.length}** penjualan.`,
      icon: <BarChart3 className="h-4 w-4 text-blue-500" />,
    });
  }

  // 3. Margin & Health check
  if (totalIncome > 0) {
    const margin = Math.round((totalProfit / totalIncome) * 100);
    let status = "Sangat Sehat";
    if (margin < 10) {
      status = "Perlu Waspada (Margin tipis)";
    } else if (margin < 25) {
      status = "Cukup Stabil";
    }
    insights.push({
      id: "ins-health",
      text: `Margin bersih toko berada di angka **${margin}%** (${status}). Selalu pantau operasional Bos!`,
      icon: <BrainCircuit className="h-4 w-4 text-violet-500" />,
    });
  }

  return insights;
}

// ─── Page ─────────────────────────────────────────────────────────
export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("kas");

  const [storeName, setStoreName] = useState("");
  const [showSetup, setShowSetup] = useState(false);
  const [activePeriod, setActivePeriod] = useState("all");
  const [editingTx, setEditingTx] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [newestId, setNewestId] = useState(null);

  // Trigger clear/reset chat dari sidebar desktop
  const [clearChatSignal, setClearChatSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);

  // Shared chat messages state so history is preserved between mobile/desktop viewport resizing
  const [chatMessages, setChatMessages] = useState(() => [
    {
      id: "welcome",
      sender: "ai",
      text: 'Halo Bos!\n\nSaya **Catetin AI**, asisten keuangan pribadi tokomu. Bos bisa catat penjualan atau pengeluaran toko langsung di sini.\n\nContoh:\n• *"jual kopi susu 5 porsi 75 ribu"*\n• *"beli gas LPG 22rb"*\n• *"bayar tagihan listrik 150 ribu"*',
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  // ── Theme & Store Name & Period init ──────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("catetin-theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    const savedStore = localStorage.getItem("catetin-store-name");
    if (savedStore) {
      setStoreName(savedStore);
    } else {
      setShowSetup(true);
    }

    const savedPeriod = localStorage.getItem("catetin-period") || "all";
    setActivePeriod(savedPeriod);
  }, []);

  // ── Load transactions dari Supabase ─────────────────────────────
  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      // Determine ownership context
      const { data: userData } = await supabase.auth.getUser();
      const isAuth = !!userData?.user?.id;
      const query = supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      const { data, error } = isAuth
        ? await query.eq("user_id", userData.user.id)
        : await query.eq("session_id", getGuestId());

      if (error) {
        toast.error("Gagal memuat data", { description: error.message });
      } else {
        setTransactions((data ?? []).map(dbToApp));
      }
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("catetin-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  // ── Add transaction → INSERT ─────────────────────────────────────
  const handleAddTransaction = async (newTx) => {
    // Resolve ownership before insert
    const { data: userData } = await supabase.auth.getUser();
    const insertPayload = {
      ...appToDb(newTx),
      ...(userData?.user?.id
        ? { user_id: userData.user.id }
        : { session_id: getGuestId() }),
    };
    const { data, error } = await supabase
      .from("transactions")
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      toast.error("Gagal menyimpan transaksi", { description: error.message });
      return;
    }

    const mapped = dbToApp(data);
    setTransactions((prev) => [mapped, ...prev]);
    setNewestId(mapped.id);
    setTimeout(() => {
      setNewestId((curr) => (curr === mapped.id ? null : curr));
    }, 3000);

    toast.success("Catatan berhasil disimpan", {
      description: `${
        newTx.type === "income" ? "Pemasukan" : "Pengeluaran"
      }: ${newTx.item} (${formatRupiah(newTx.amount)})`,
    });
  };

  // ── Edit transaction → UPDATE ────────────────────────────────────
  const handleEditTransaction = async (id, updatedData) => {
    const { error } = await supabase
      .from("transactions")
      .update({
        item_name: updatedData.item,
        amount: updatedData.amount,
        category: updatedData.category,
        type: updatedData.type,
        qty: updatedData.qty,
        unit: updatedData.unit,
      })
      .eq("id", id);

    if (error) {
      toast.error("Gagal mengubah transaksi", { description: error.message });
      return;
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              type: updatedData.type,
              item: updatedData.item,
              category: updatedData.category,
              amount: updatedData.amount,
              qty: updatedData.qty,
              unit: updatedData.unit,
            }
          : t,
      ),
    );
    toast.success("Transaksi berhasil diperbarui");
  };

  // ── Delete transaction → DELETE ──────────────────────────────────
  const handleDeleteTransaction = async (id) => {
    const tx = transactions.find((t) => t.id === id);
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      toast.error("Gagal menghapus transaksi", { description: error.message });
      return;
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    if (tx)
      toast.error("Transaksi dihapus", {
        description: `${tx.item} telah dikeluarkan dari kas.`,
      });
  };

  // ── Clear all → DELETE only this user/guest's rows ──────────────
  const handleClearTransactions = async () => {
    // Resolve ownership — same logic as fetch & insert
    const { data: userData } = await supabase.auth.getUser();
    const isAuth = !!userData?.user?.id;

    const query = supabase.from("transactions").delete();
    const { error } = isAuth
      ? await query.eq("user_id", userData.user.id)
      : await query.eq("session_id", getGuestId());

    if (error) {
      toast.error("Gagal mereset data", { description: error.message });
      return;
    }

    setTransactions([]);
    toast.info("Buku Kas berhasil dikosongkan");
  };

  const handlePeriodChange = (period) => {
    setActivePeriod(period);
    localStorage.setItem("catetin-period", period);
  };

  // ── Filter transactions ──────────────────────────────────────────
  const filteredTransactions = transactions.filter((tx) => {
    if (activePeriod === "all") return true;
    const txDate = new Date(tx.createdAt || Date.now());
    const now = new Date();

    if (activePeriod === "today") {
      return txDate.toDateString() === now.toDateString();
    }
    if (activePeriod === "week") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return txDate >= sevenDaysAgo;
    }
    if (activePeriod === "month") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return txDate >= thirtyDaysAgo;
    }
    return true;
  });

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((s, tx) => s + tx.amount, 0);
  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((s, tx) => s + tx.amount, 0);
  const totalProfit = totalIncome - totalExpense;

  if (!mounted) return <div className="min-h-screen bg-zinc-950" />;

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-[#0C0C0B] transition-colors duration-300 font-sans">
      <Toaster
        position="top-center"
        richColors
        theme={theme === "dark" ? "dark" : "light"}
      />

      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        storeName={storeName}
        onExport={() => setShowExport(true)}
      />

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
              transactions={transactions}
              messages={chatMessages}
              setMessages={setChatMessages}
            />
          </div>
        )}

        {activeTab === "kas" && (
          <KasPanel
            transactions={filteredTransactions}
            allTransactions={transactions}
            loading={loading}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            totalProfit={totalProfit}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={setEditingTx}
            activePeriod={activePeriod}
            onPeriodChange={handlePeriodChange}
            onExport={() => setShowExport(true)}
            newestId={newestId}
          />
        )}

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/90 dark:bg-[#0E0E0E]/90 border-t border-stone-200/50 dark:border-zinc-800/60 px-8 py-3.5 flex items-center justify-around">
          {[
            { id: "kas", label: "Buku Kas", Icon: BarChart3 },
            { id: "chat", label: "Asisten AI", Icon: Sparkles },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 active:scale-90",
                activeTab === id
                  ? "text-emerald-600 dark:text-emerald-400 font-extrabold scale-105"
                  : "text-zinc-400 dark:text-zinc-500 font-bold",
              )}
            >
              <Icon
                className={cn("h-5 w-5", activeTab === id && "animate-pulse")}
              />
              <span className="text-[10px] tracking-wide font-extrabold">
                {label}
              </span>
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
          <div
            className={cn(
              "flex flex-col border-r border-stone-200/50 dark:border-zinc-800/60 transition-all duration-300",
              activeTab === "kas" ? "w-0 overflow-hidden opacity-0" : "flex-1",
            )}
          >
            <AIAssistant
              onAddTransaction={handleAddTransaction}
              onClearTransactions={handleClearTransactions}
              inline
              clearSignal={clearChatSignal}
              resetSignal={resetSignal}
              transactions={transactions}
              messages={chatMessages}
              setMessages={setChatMessages}
            />
          </div>

          <div
            className={cn(
              "flex flex-col overflow-hidden transition-all duration-300",
              activeTab === "chat" ? "w-0 overflow-hidden opacity-0" : "flex-1",
            )}
          >
            <KasPanel
              transactions={filteredTransactions}
              allTransactions={transactions}
              loading={loading}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              totalProfit={totalProfit}
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={setEditingTx}
              activePeriod={activePeriod}
              onPeriodChange={handlePeriodChange}
              onExport={() => setShowExport(true)}
              newestId={newestId}
            />
          </div>
        </div>
      </div>

      {/* Modals & Panels */}
      {showSetup && (
        <StoreSetupModal
          onComplete={(name) => {
            setStoreName(name);
            setShowSetup(false);
          }}
        />
      )}

      {editingTx && (
        <EditTransactionModal
          tx={editingTx}
          onSave={handleEditTransaction}
          onClose={() => setEditingTx(null)}
        />
      )}

      {showExport && (
        <ExportPanel
          transactions={filteredTransactions}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          totalProfit={totalProfit}
          period={activePeriod}
          storeName={storeName}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
