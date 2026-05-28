import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("=== START AI RECEIPT SCANNER API ===");
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("API Error: GEMINI_API_KEY is not defined in env variables.");
      return NextResponse.json(
        { error: "GEMINI_API_KEY_MISSING", message: "API Key Gemini belum diatur di .env.local" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { image, mimeType } = body;

    if (!image || !mimeType) {
      console.error("API Error: Missing image or mimeType in request body.");
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Gambar atau tipe MIME tidak boleh kosong" },
        { status: 400 }
      );
    }

    console.log(`Received image. MIME type: ${mimeType}. Size of payload: ${image.length} chars.`);

    // Clean base64 string safely by splitting at ";base64,"
    const base64Data = image.includes(";base64,") ? image.split(";base64,").pop() : image;
    console.log("Cleaned base64 payload prefix successfully.");

    const systemInstruction = `
Kamu adalah modul OCR & parsing keuangan pintar khusus untuk UMKM Indonesia.
Tugas kamu adalah menganalisa foto struk belanja, faktur, nota, atau tagihan secara presisi.

PANDUAN PARSING:
1. Deteksi apakah gambar benar-benar merupakan struk belanja, nota, kuitansi, faktur, atau bukti pembayaran yang valid. Jika tidak valid/kurang jelas, kembalikan 'success: false' dan kosongkan list item.
2. Identifikasi merchant/nama toko (jika ada).
3. Ekstrak setiap baris item belanja/pemasukan secara terperinci.
4. Klasifikasikan tipe transaksi: sebagian besar struk belanja adalah "expense" (pengeluaran), kecuali jika struk tersebut adalah bukti penjualan/penerimaan uang toko ("income").
5. Kategorikan setiap item ke salah satu kategori ini:
   - "food": Makanan, minuman, bahan dapur, kopi, makan siang, cemilan.
   - "shopping": Belanja perlengkapan toko, alat tulis, sabun cuci, kantong plastik, barang operasional harian.
   - "bills": Tagihan listrik, air, internet wifi, pulsa, token.
   - "salary": Gaji karyawan, upah harian.
   - "rent": Sewa toko, sewa lapak bulanan/tahunan.
   - "other": Item lain yang tidak masuk kategori di atas.
6. Bersihkan nama item dari angka, simbol harga, atau kuantitas. Buat menjadi Title Case (kapitalisasi huruf depan tiap kata, e.g. "Minyak Goreng Bimoli").
7. Ekstrak nominal total belanja per item (qty * unit price) secara bersih dalam angka Rupiah tanpa simbol Rp atau titik/koma ribuan.
8. Deteksi kuantitas (qty) dan satuan unit (misal: "kg", "pcs", "porsi", "botol", "bungkus"). Jika unit tidak disebutkan, berikan null.
`;

    console.log("Initializing Google Generative AI...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction, // Fix: Ensure system instructions are passed here
    });

    const prompt = `
Analisa struk ini dan kembalikan data dalam bentuk JSON terstruktur sesuai schema.
Pastikan tidak berhalusinasi. Jika gambar bukan struk pembayaran/nota/faktur, kembalikan success=false.
`;

    console.log("Sending payload to Gemini 2.5 Flash Vision...");
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "True jika gambar adalah struk/nota valid dan berhasil diproses. False jika bukan struk atau gambar rusak/tidak terbaca.",
            },
            merchantName: {
              type: "string",
              description: "Nama toko/merchant (e.g. 'Indomaret'). Kosongkan atau null jika tidak terdeteksi.",
            },
            items: {
              type: "array",
              description: "Daftar item transaksi yang ditemukan di struk.",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["income", "expense"],
                    description: "Tipe transaksi. Default adalah 'expense' untuk belanja.",
                  },
                  item: {
                    type: "string",
                    description: "Nama barang yang dibeli/dijual bersih dan rapi (Title Case). E.g. 'Gula Pasir'.",
                  },
                  qty: {
                    type: "number",
                    description: "Jumlah unit barang.",
                  },
                  unit: {
                    type: "string",
                    description: "Satuan unit (e.g. 'pcs', 'kg', 'porsi') atau null jika tidak ada.",
                  },
                  amount: {
                    type: "number",
                    description: "Total harga transaksi untuk baris item ini saja (bukan harga satuan).",
                  },
                  category: {
                    type: "string",
                    enum: ["food", "shopping", "bills", "salary", "rent", "other"],
                    description: "Klasifikasi kategori item tersebut.",
                  },
                },
                required: ["type", "item", "qty", "amount", "category"],
              },
            },
          },
          required: ["success", "items"],
        },
      },
    });

    const responseText = result.response.text();
    console.log("Raw response from Gemini Vision:", responseText);

    // Clean JSON formatting if Gemini returned markdown block
    let cleanText = responseText.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```(?:json)?\n?/i, "");
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.slice(0, -3).trim();
    }

    let parsedData;
    try {
      parsedData = JSON.parse(cleanText);
    } catch (parseErr) {
      console.error("Failed to parse JSON response from Gemini. Raw response was:", responseText, parseErr);
      return NextResponse.json(
        {
          error: "INVALID_JSON_RESPONSE",
          message: "AI tidak mengembalikan format data yang valid. Silakan coba kembali dengan foto struk yang lebih jelas."
        },
        { status: 422 }
      );
    }

    console.log("=== END API - SUCCESS ===");
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("CRITICAL API Scan Receipt Error:", error);

    const msg = error.message || "";
    const isRateLimit =
      msg.includes("429") ||
      msg.toLowerCase().includes("quota exceeded") ||
      msg.toLowerCase().includes("too many requests");

    if (isRateLimit) {
      console.warn("API Rate limit hit on Gemini Vision.");
      return NextResponse.json(
        {
          error: "RATE_LIMIT_EXCEEDED",
          message: "Kuota harian Gemini AI sudah habis. Silakan coba kembali nanti.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "API_ERROR",
        message: `Gagal memproses struk. Alasan: ${error.message || "Terjadi kesalahan internal"}`
      },
      { status: 500 }
    );
  }
}
