const INCOME_KEYWORDS = /\b(jual|pemasukan|masuk|order|pesanan|pendapatan)\b/i;
const EXPENSE_KEYWORDS =
  /\b(beli|bayar|belanja|pengeluaran|keluar|ongkos|gaji|upah|sewa)\b/i;

const CATEGORY_KEYWORDS = {
  food: /nasi|kopi|ayam|jus|teh|gorengan|telur|susu|bakso|makanan|es|mie|soto|bubur/i,
  shopping: /gas|minyak|kresek|sabun|belanja|operasional|bahan/i,
  bills: /listrik|air|pulsa|internet|wifi|token|telkom/i,
  salary: /gaji|karyawan|bonus|staf|upah/i,
  rent: /sewa|kontrak|ruko|lapak/i,
};

function detectCategory(text) {
  for (const [key, regex] of Object.entries(CATEGORY_KEYWORDS)) {
    if (regex.test(text)) return key;
  }
  return "other";
}

function extractMoney(text) {
  const moneyRegex =
    /(?:rp\.?\s*)?(\d+(?:[.,]\d+)?)\s*(miliar|triliun|juta|jt|ribu|rb|k|000|m|b|t)?/gi;
  const matches = [];
  let match;

  while ((match = moneyRegex.exec(text)) !== null) {
    matches.push({
      fullMatch: match[0],
      num: parseFloat(match[1].replace(/[.,]/g, "")),
      suffix: match[2]?.toLowerCase() ?? "",
      index: match.index,
    });
  }

  if (matches.length === 0) return null;

  const last = matches[matches.length - 1];
  const multipliers = {
    rb: 1_000,
    ribu: 1_000,
    k: 1_000,
    "000": 1_000,
    jt: 1_000_000,
    juta: 1_000_000,
    m: 1_000_000,
    miliar: 1_000_000_000,
    b: 1_000_000_000,
    t: 1_000_000_000_000,
    triliun: 1_000_000_000_000,
  };

  let amount = 0;
  if (multipliers[last.suffix]) {
    amount = last.num * multipliers[last.suffix];
  } else if (/rp\.?\s*/i.test(last.fullMatch) || last.num >= 100) {
    amount = last.num;
  } else if (last.num > 0) {
    amount = last.num * 1_000; // shorthand: "60" → 60.000
  }

  // Cek qty dari number sebelumnya jika ada
  let qty = 1;
  if (matches.length > 1) {
    const first = matches[0];
    if (first.num > 0 && first.num < 100 && first.index !== last.index) {
      qty = first.num;
    }
  }

  return { amount, qty, matches };
}

function extractQtyWithUnit(text) {
  const regex =
    /(\d+)\s*(porsi|pcs|biji|bungkus|buah|gelas|pax|item|box|botol|lembar|piring)/gi;
  const match = regex.exec(text);
  return match ? { qty: parseInt(match[1], 10), fullMatch: match[0] } : null;
}

function extractItemName(text, moneyMatches = [], qtyFullMatch = "") {
  let clean = text
    .replace(
      /\b(jual|beli|bayar|belanja|pemasukan|pengeluaran|tambah|catat)\b/gi,
      "",
    )
    .replace(qtyFullMatch, "");

  moneyMatches.forEach((m) => {
    clean = clean.replace(m.fullMatch, "");
  });

  clean = clean.replace(/\s+/g, " ").trim();

  return clean
    ? clean
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Tanpa Keterangan";
}

// ─── Word number fallback ────────────────────────────────────────
const WORD_NUMBERS = {
  "dua puluh ribu": 20_000,
  "tiga puluh ribu": 30_000,
  "empat puluh ribu": 40_000,
  "lima puluh ribu": 50_000,
  "seratus ribu": 100_000,
};

// ─── Public API ──────────────────────────────────────────────────
export function parseTransactionText(text) {
  const t = text.toLowerCase();

  const hasIncome = INCOME_KEYWORDS.test(t);
  const hasExpense = EXPENSE_KEYWORDS.test(t);

  if (hasIncome && hasExpense) {
    return {
      success: false,
      reason: "ambiguous",
      message: "transaksi tidak jelas / ambigu",
    };
  }
  if (!hasIncome && !hasExpense) {
    return {
      success: false,
      reason: "no_intent",
      message: "tidak ada kata kunci jual, beli, bayar, dll.",
    };
  }

  const type = hasExpense ? "expense" : "income"; // selalu canonical English

  const qtyUnit = extractQtyWithUnit(t);
  const workingText = qtyUnit ? t.replace(qtyUnit.fullMatch, " ") : t;

  const moneyResult = extractMoney(workingText);

  let amount = 0;
  let qty = qtyUnit?.qty ?? 1;

  if (moneyResult && moneyResult.amount > 0) {
    amount = moneyResult.amount;
    if (!qtyUnit && moneyResult.qty > 1) qty = moneyResult.qty;
  } else {
    // Fallback ke word numbers
    for (const [phrase, val] of Object.entries(WORD_NUMBERS)) {
      if (t.includes(phrase)) {
        amount = val;
        break;
      }
    }
  }

  if (amount === 0) {
    return {
      success: false,
      reason: "no_amount",
      message: "nominal belum ditemukan (misal: 60rb, 25k, 100 ribu)",
    };
  }

  const item = extractItemName(
    t,
    moneyResult?.matches ?? [],
    qtyUnit?.fullMatch ?? "",
  );
  const category = detectCategory(item.toLowerCase());

  return { success: true, data: { type, item, qty, amount, category } };
}

// ─── Split teks input jadi segmen transaksi ──────────────────────
export function splitIntoSegments(text) {
  const keywordRegex =
    /(\s+)(jual|beli|bayar|belanja|ongkos|pengeluaran|pemasukan|pendapatan|gaji|sewa|order|pesanan|stok|modal)\b/gi;
  const segments = [];

  text.split(/\r?\n/).forEach((line) => {
    const clean = line.replace(/^\s*[•\-*#\d+.)]\s*/, "").trim();
    if (!clean) return;
    const delimited = clean.replace(
      keywordRegex,
      (_, space, word) => `|||${word}`,
    );
    delimited
      .split("|||")
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((s) => segments.push(s));
  });

  return segments;
}
