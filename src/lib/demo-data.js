/**
 * Generates realistic financial transaction history for UMKM demo mode.
 * Distributed dynamically over the past 7 days.
 */
export function getDemoTransactions() {
  const now = new Date();

  const daysAgo = (num) => {
    const d = new Date(now);
    d.setDate(now.getDate() - num);
    return d.toISOString();
  };

  return [
    {
      id: "demo-1",
      type: "income",
      item_name: "Penjualan Kopi Susu",
      category: "food",
      amount: 150000,
      qty: 10,
      unit: "gelas",
      created_at: daysAgo(0),
    },
    {
      id: "demo-2",
      type: "expense",
      item_name: "Isi Ulang Gas LPG 3kg",
      category: "shopping",
      amount: 44000,
      qty: 2,
      unit: "tabung",
      created_at: daysAgo(0),
    },
    {
      id: "demo-3",
      type: "income",
      item_name: "Penjualan Nasi Goreng Ayam",
      category: "food",
      amount: 240000,
      qty: 12,
      unit: "porsi",
      created_at: daysAgo(1),
    },
    {
      id: "demo-4",
      type: "expense",
      item_name: "Belanja Bahan Baku Sembako",
      category: "shopping",
      amount: 450000,
      qty: 1,
      unit: "box",
      created_at: daysAgo(1),
    },
    {
      id: "demo-5",
      type: "income",
      item_name: "Pesanan Catering Tumpeng",
      category: "food",
      amount: 1250000,
      qty: 1,
      unit: "pax",
      created_at: daysAgo(2),
    },
    {
      id: "demo-6",
      type: "expense",
      item_name: "Listrik Token Kios",
      category: "bills",
      amount: 185000,
      qty: 1,
      unit: null,
      created_at: daysAgo(2),
    },
    {
      id: "demo-7",
      type: "income",
      item_name: "Penjualan Roti Bakar Cokelat",
      category: "food",
      amount: 180000,
      qty: 9,
      unit: "porsi",
      created_at: daysAgo(3),
    },
    {
      id: "demo-8",
      type: "expense",
      item_name: "Gaji Karyawan Mingguan",
      category: "salary",
      amount: 800000,
      qty: 1,
      unit: "orang",
      created_at: daysAgo(3),
    },
    {
      id: "demo-9",
      type: "income",
      item_name: "Penjualan Jus Buah Naga",
      category: "food",
      amount: 110000,
      qty: 11,
      unit: "gelas",
      created_at: daysAgo(4),
    },
    {
      id: "demo-10",
      type: "expense",
      item_name: "Sewa Lapak Kios Tambahan",
      category: "rent",
      amount: 300000,
      qty: 1,
      unit: "bulan",
      created_at: daysAgo(5),
    },
    {
      id: "demo-11",
      type: "income",
      item_name: "Order Kue Nastar Lebaran",
      category: "shopping",
      amount: 750000,
      qty: 5,
      unit: "toples",
      created_at: daysAgo(6),
    },
    {
      id: "demo-12",
      type: "expense",
      item_name: "Internet Wifi Toko",
      category: "bills",
      amount: 150000,
      qty: 1,
      unit: null,
      created_at: daysAgo(6),
    }
  ];
}
