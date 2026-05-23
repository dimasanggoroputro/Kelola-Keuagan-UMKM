import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY_MISSING", message: "API Key Gemini belum diatur di .env.local" },
        { status: 400 }
      );
    }

    const { message, history = [], transactions = [] } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemInstruction = `
Kamu adalah "Catetin AI", asisten keuangan pribadi digital yang ramah, santai, dan solutif untuk pelaku UMKM di Indonesia.
Tugas utama kamu adalah membantu mencatat transaksi dan memahami kondisi keuangan toko mereka.

PANDUAN INTERAKSI:
- Selalu panggil pengguna dengan sebutan "Bos" (misal: "Siap Bos!", "Ada yang bisa saya bantu catat, Bos?").
- Gunakan bahasa Indonesia yang santai, bersahabat, tapi tetap sopan.
- Berikan analisis atau saran keuangan jika mereka bertanya tentang keuangan.
- Jangan gunakan emoji terlalu berlebihan.

CONTEXT TRANSAKSI SAAT INI:
Berikut adalah daftar transaksi yang terdaftar di sistem Buku Kas saat ini:
${JSON.stringify(transactions, null, 2)}

Jika pengguna bertanya tentang statistik keuangan (misal: total pemasukan, pengeluaran, keuntungan, ringkasan, atau barang paling laris), hitung secara akurat berdasarkan data transaksi di atas dan berikan penjelasan singkat yang mudah dimengerti.

PENCATATAN TRANSAKSI:
Jika pengguna menyebutkan transaksi baru (pemasukan/pengeluaran) untuk dicatat, ekstrak transaksi tersebut ke dalam array 'transactions'.
Jika pengguna membatalkan transaksi atau sekadar bertanya biasa, kosongkan array 'transactions'.
Pastikan nominal uang dikonversi menjadi angka penuh (misal: "50rb" -> 50000, "1.2jt" -> 1200000).
Unit satuan (unit) harus diekstrak jika ada (misal: 'kg', 'gr', 'liter', 'ml', 'pcs', 'porsi', 'botol', dll) atau null jika tidak disebutkan.
Nama barang (item) harus capitalized (misal: 'Buah Leci') dan bersih dari nominal/qty.
Kategori harus salah satu dari: "food", "shopping", "bills", "salary", "rent", "other".
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    // Formatting history into Gemini structure
    // Gemini chat expects: { role: 'user'|'model', parts: [{ text: '...' }] }
    // Pastikan welcome message dibuang dan riwayat dimulai dengan peran 'user'
    const geminiHistory = history
      .filter((msg) => msg.id !== "welcome")
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    while (geminiHistory.length > 0 && geminiHistory[0].role !== "user") {
      geminiHistory.shift();
    }

    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            response: {
              type: "string",
              description: "Jawaban percakapan asisten (dapat mengandung markdown format, gunakan Bahasa Indonesia ramah Bos)."
            },
            transactions: {
              type: "array",
              description: "Daftar transaksi baru yang perlu disimpan ke database dari pesan terakhir. Kosongkan [] jika hanya tanya jawab biasa.",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["income", "expense"],
                    description: "Tipe transaksi."
                  },
                  item: {
                    type: "string",
                    description: "Nama item / deskripsi transaksi (e.g. 'Buah Leci')."
                  },
                  qty: {
                    type: "number",
                    description: "Jumlah barang."
                  },
                  unit: {
                    type: "string",
                    description: "Satuan unit (e.g. 'kg', 'pcs', 'porsi') atau null jika tidak disebutkan."
                  },
                  amount: {
                    type: "number",
                    description: "Nominal uang total transaksi ini dalam Rupiah."
                  },
                  category: {
                    type: "string",
                    enum: ["food", "shopping", "bills", "salary", "rent", "other"],
                    description: "Kategori pengeluaran/pemasukan."
                  }
                },
                required: ["type", "item", "qty", "amount", "category"]
              }
            }
          },
          required: ["response", "transactions"]
        }
      }
    });


    const result = await chat.sendMessage(message);
    const responseText = result.response.text();
    
    // Parse the JSON response
    const parsedData = JSON.parse(responseText);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("API Chat Error:", error);
    return NextResponse.json(
      { error: "API_ERROR", message: error.message || "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
