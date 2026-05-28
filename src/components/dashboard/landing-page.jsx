"use client";

import { Sparkles, MessageSquare, TrendingUp, Smartphone, ArrowRight, Zap, CheckCircle } from "lucide-react";

export default function LandingPage({ onStartGuest, onStartDemo, onLogin }) {
  return (
    <div className="min-h-screen bg-[#0C0C0B] text-zinc-100 flex flex-col font-sans overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none select-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[35%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[5%] right-[20%] w-[30%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b border-zinc-900 bg-[#0C0C0B]/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-md shadow-emerald-500/25">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-black tracking-wider text-white uppercase">
            Catetin<span className="text-emerald-400">.AI</span>
          </span>
        </div>
        <div>
          <button
            onClick={onLogin}
            className="text-xs font-bold text-zinc-300 hover:text-white px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:bg-zinc-800 hover:border-zinc-700 active:scale-95 transition-all cursor-pointer shadow-3xs"
          >
            Masuk Akun
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pt-16 pb-20 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest mb-6 animate-fade-in">
          <Zap className="h-3 w-3 fill-emerald-400/20" />
          <span>AI-Powered Finance untuk UMKM</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight max-w-3xl">
          Catat Keuangan Toko <br />
          <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-indigo-400 bg-clip-text text-transparent">
            Cukup Lewat Chat
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl">
          Asisten keuangan pintar berbasis AI yang dirancang khusus untuk UMKM Indonesia.
          Ngobrol santai dalam bahasa Indonesia, catat pemasukan/pengeluaran otomatis, dan pantau wawasan bisnis Bos tanpa ribet.
        </p>

        {/* CTA Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-4">
          <button
            onClick={onStartGuest}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-xs font-black tracking-wide hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all cursor-pointer shadow-lg shadow-emerald-500/15"
          >
            Mulai Tanpa Login
            <ArrowRight className="h-4 w-4 stroke-[2.5px]" />
          </button>
          
          <button
            onClick={onStartDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-800/80 hover:text-white active:scale-95 transition-all cursor-pointer shadow-3xs"
          >
            Coba Demo Interaktif
          </button>
        </div>

        {/* App Preview Mockup */}
        <div className="mt-14 w-full rounded-2xl border border-zinc-800 bg-zinc-950/45 p-1.5 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-5 pointer-events-none rounded-2xl" />
          <div className="rounded-xl overflow-hidden border border-zinc-800/60 bg-[#0E0E0F]">
            {/* Window bar */}
            <div className="bg-zinc-900/60 border-b border-zinc-950 px-3 py-2 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-rose-500/60" />
              <div className="h-2 w-2 rounded-full bg-amber-500/60" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
              <div className="text-[9px] font-bold text-zinc-500 ml-2 tracking-wide">catetin.ai - Aplikasi Keuangan Pintar</div>
            </div>
            
            {/* Teaser Interface content */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 text-left">
              {/* Left Column: Chat Preview */}
              <div className="md:col-span-7 space-y-3.5 border-r border-zinc-900 pr-0 md:pr-4">
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  Cara Kerja Catetin AI
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="h-6 w-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] shrink-0 text-zinc-400 font-bold">
                      B
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-zinc-900 border border-zinc-800/60 px-3.5 py-2 text-xs text-zinc-300 max-w-[85%] font-medium">
                      jual es teh manis 12 gelas 36 ribu, trus beli es batu 10rb
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-emerald-950/20 border border-emerald-800/20 px-3.5 py-2 text-xs text-zinc-300 max-w-[85%] space-y-1.5">
                      <p className="font-medium text-emerald-400">Siap Bos, sudah saya catat:</p>
                      <div className="text-[10px] space-y-1 font-bold font-mono text-zinc-400 bg-zinc-950/80 p-2 rounded-lg border border-zinc-900">
                        <div className="text-emerald-400">+ Pemasukan: Es Teh Manis (12x) • Rp 36.000</div>
                        <div className="text-rose-400">- Pengeluaran: Es Batu • Rp 10.000</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Statistics teaser */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    Statistik Usaha Bos
                  </div>
                  <div className="text-lg font-black text-white">Rp 26.000</div>
                  <div className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Untung bersih bertambah
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-2.5">
                  <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Distribusi Biaya</span>
                    <span className="text-rose-400">Rp 10.000</span>
                  </div>
                  {/* Visual mini bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-zinc-300">
                      <span>Kuliner / Bahan</span>
                      <span>100%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 text-left px-2">
          {/* Card 1 */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5 hover:border-zinc-800 hover:bg-zinc-900/20 transition-all group">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
            </div>
            <h4 className="text-xs font-black text-white tracking-wide uppercase">Pencatatan Lewat Chat</h4>
            <p className="mt-2 text-[11px] text-zinc-400 font-medium leading-relaxed">
              Ketik atau gunakan suara untuk mencatat transaksi. AI otomatis menganalisis teks, nominal, jumlah barang, dan kategori dalam hitungan detik.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5 hover:border-zinc-800 hover:bg-zinc-900/20 transition-all group">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
            </div>
            <h4 className="text-xs font-black text-white tracking-wide uppercase">Analisis Wawasan AI</h4>
            <p className="mt-2 text-[11px] text-zinc-400 font-medium leading-relaxed">
              Dapatkan laporan margin laba kotor, produk terlaris, dan pengeluaran terbesar yang mudah dimengerti tanpa perlu laporan akuntansi yang rumit.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5 hover:border-zinc-800 hover:bg-zinc-900/20 transition-all group">
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="h-4 w-4 text-amber-400" />
            </div>
            <h4 className="text-xs font-black text-white tracking-wide uppercase">Dukungan PWA & Offline</h4>
            <p className="mt-2 text-[11px] text-zinc-400 font-medium leading-relaxed">
              Instal aplikasi langsung ke layar utama smartphone Bos. Ringan, cepat, dan siap digunakan kapan pun dibutuhkan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-zinc-900 w-full text-center">
          <p className="text-[10px] font-bold text-zinc-600">
            &copy; {new Date().getFullYear()} Catetin AI. Built for Indonesian UMKM. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
