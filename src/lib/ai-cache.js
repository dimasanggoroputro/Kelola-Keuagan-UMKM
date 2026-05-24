/**
 * ai-cache.js
 * Cache jawaban Gemini AI di localStorage.
 *
 * Strategi:
 * - Hanya cache respons tanpa transaksi (Q&A murni).
 *   Pencatatan transaksi TIDAK di-cache agar tidak dobel catat.
 * - TTL default 1 jam.
 * - Maksimal 60 entri; entri tertua dihapus otomatis.
 */

const STORAGE_KEY = "catetin-ai-cache";
const TTL_MS = 60 * 60 * 1000; // 1 jam
const MAX_ENTRIES = 60;

// ── Helpers ─────────────────────────────────────────────────────────

/** Normalisasi pesan agar variasi penulisan (spasi, huruf besar) tetap match */
function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:]+$/, ""); // buang tanda baca di akhir
}

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage penuh — hapus cache lama dan coba lagi
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Ambil respons dari cache.
 * @returns {object|null} data cache { response, transactions } atau null jika miss/expired
 */
export function getCachedResponse(message) {
  if (typeof window === "undefined") return null;

  const cache = loadCache();
  const key = normalize(message);
  const entry = cache[key];

  if (!entry) return null;

  // Cek apakah sudah expired
  if (Date.now() - entry.timestamp > TTL_MS) {
    delete cache[key];
    saveCache(cache);
    return null;
  }

  return entry.data;
}

/**
 * Simpan respons ke cache.
 * Hanya menyimpan jika respons tidak mengandung transaksi baru.
 */
export function setCachedResponse(message, data) {
  if (typeof window === "undefined") return;

  // Jangan cache pencatatan transaksi — user mungkin ingin catat ulang
  if (data.transactions && data.transactions.length > 0) return;

  const cache = loadCache();
  const key = normalize(message);

  cache[key] = {
    timestamp: Date.now(),
    data,
  };

  // Jaga ukuran cache maksimal MAX_ENTRIES entri
  const keys = Object.keys(cache);
  if (keys.length > MAX_ENTRIES) {
    // Hapus entri paling lama
    const sorted = keys.sort(
      (a, b) => (cache[a]?.timestamp ?? 0) - (cache[b]?.timestamp ?? 0),
    );
    sorted.slice(0, keys.length - MAX_ENTRIES).forEach((k) => delete cache[k]);
  }

  saveCache(cache);
}

/** Hapus seluruh cache (dipanggil saat reset data) */
export function clearAICache() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/** Info debug: kembalikan jumlah entri cache yang masih valid */
export function getCacheStats() {
  if (typeof window === "undefined") return { total: 0, valid: 0 };
  const cache = loadCache();
  const now = Date.now();
  const keys = Object.keys(cache);
  const valid = keys.filter((k) => now - (cache[k]?.timestamp ?? 0) <= TTL_MS).length;
  return { total: keys.length, valid };
}
