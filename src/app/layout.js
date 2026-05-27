import "./globals.css";

export const metadata = {
  title: "Catetin AI — Asisten Keuangan Pintar UMKM",
  description:
    "Aplikasi pencatatan keuangan bertenaga AI untuk UMKM Indonesia. Catat pendapatan dan pengeluaran semudah berkirim pesan chatting.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
