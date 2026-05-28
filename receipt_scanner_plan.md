Bikin file `receipt_scanner_plan.md` terus isi dengan ini 👇

````md
# Catetin AI — AI Receipt Scanner Feature

## Overview
Tambahkan fitur AI Receipt Scanner agar pengguna UMKM dapat mencatat transaksi hanya dengan memfoto atau upload struk belanja/penjualan.

AI akan membaca isi struk menggunakan Gemini Vision lalu mengubahnya menjadi transaksi terstruktur yang langsung bisa masuk ke dashboard keuangan.

Feature ini harus terasa modern, mobile-first, cepat, dan seperti aplikasi fintech sungguhan.

---

# Main Goals

Feature harus memungkinkan user untuk:

- Foto struk langsung dari kamera HP
- Upload gambar struk dari galeri
- AI membaca isi struk otomatis
- AI mendeteksi:
  - nama barang
  - qty
  - nominal
  - kategori
  - tipe transaksi
- User bisa review/edit hasil AI
- Simpan transaksi ke Supabase
- Dashboard update realtime

---

# UX Flow

## Receipt Scanner Flow

1. User klik tombol kamera
2. Muncul pilihan:
   - Ambil Foto
   - Upload dari Galeri
3. User memilih/memfoto struk
4. Preview gambar muncul
5. AI menganalisa struk
6. Hasil parsing tampil dalam preview transaksi
7. User bisa edit jika ada kesalahan
8. User klik Simpan
9. Data masuk ke database & dashboard update realtime

---

# UI / UX Requirements

## Design Rules

- Mobile-first
- Dark mode compatible
- Gunakan Lucide React icons
- Jangan gunakan emoji
- Gunakan bottom-sheet style di mobile
- Gunakan animasi smooth & premium
- Style harus konsisten dengan dashboard Catetin AI sekarang

---

# New Components

## [NEW] receipt-scanner.jsx

### Responsibilities
- Modal / bottom sheet scanner
- Pilihan:
  - Camera capture
  - Gallery upload
- Image preview
- Loading state saat AI processing
- Error state

### Suggested Icons
- Camera
- ImagePlus
- ScanText
- LoaderCircle
- Check
- X

---

## [NEW] receipt-preview.jsx

### Responsibilities
Menampilkan hasil parsing AI sebelum disimpan.

### User Can:
- edit nama item
- edit qty
- edit nominal
- edit kategori
- hapus item salah

### Important
JANGAN langsung auto-save hasil AI.

User wajib confirm terlebih dahulu.

---

# Camera & Upload Support

## Camera Capture

Gunakan:
```html
<input type="file" accept="image/*" capture="environment" />
````

Harus:

* membuka kamera belakang HP
* mobile-friendly
* support Android & iPhone browser

---

## Gallery Upload

Gunakan:

```html
<input type="file" accept="image/*" />
```

---

# AI Receipt Parsing

## Gemini Vision Integration

Gunakan Gemini 2.5 Flash Vision untuk membaca gambar struk.

AI harus mengextract:

* merchant_name
* item_name
* qty
* amount
* category
* type (income/expense)
* receipt_date

---

# AI Parsing Rules

AI harus:

* mengembalikan JSON terstruktur
* mendukung format Rupiah:

  * rb
  * ribu
  * juta
  * miliar
* ignore text tidak penting
* handle struk blur sederhana
* tidak hallucinate transaksi aneh

---

# Expected JSON Result

```json
[
  {
    "type": "expense",
    "item_name": "Telur Ayam",
    "category": "Belanja",
    "qty": 2,
    "amount": 30000
  },
  {
    "type": "expense",
    "item_name": "Minyak Goreng",
    "category": "Belanja",
    "qty": 1,
    "amount": 18000
  }
]
```

---

# Database Integration

## [MODIFY] page.js

Tambah:

* handleSaveReceiptTransactions()
* realtime dashboard refresh
* Supabase insert integration
* toast notifications

---

# Important MVP Rules

## DO NOT:

* auto-save tanpa preview
* store gambar permanen dulu
* buat OCR system custom
* tambah dependency chart/OCR berat

## Focus:

* stable UX
* fast AI parsing
* mobile experience
* realtime dashboard sync

---

# Error Handling

Handle:

* gambar blur
* bukan struk
* upload kosong
* AI gagal parsing
* internet error
* Gemini rate limit

Gunakan pesan Bahasa Indonesia yang ramah.

Contoh:
"Struk kurang jelas. Coba ambil foto dengan pencahayaan lebih terang."

---

# Mobile Optimization

Feature harus terasa native di HP:

* full width bottom sheet
* sticky action button
* touch friendly
* responsive keyboard
* optimized image preview

---

# Security & Privacy

* Jangan expose Gemini API key
* Jangan simpan raw image di database
* Jangan log image di console
* Hanya simpan hasil transaksi

---

# Suggested Execution Order

1. Build receipt scanner UI
2. Add camera/gallery picker
3. Gemini Vision parsing
4. Receipt preview/edit UI
5. Save to Supabase
6. Polish animations & UX

---

# Verification Plan

## Manual Tests

### Camera Test

* Foto struk langsung dari HP
* AI parsing berhasil

### Gallery Test

* Upload gambar struk
* Preview tampil benar

### Edit Test

* Edit hasil parsing
* Save berhasil

### Dashboard Test

* Stats cards update realtime
* Charts update realtime
* Recent transactions update

### Error Test

* blur receipt
* random image
* empty upload

---

# Success Criteria

Feature dianggap selesai jika:

* User bisa scan struk via kamera/gallery
* AI berhasil membaca transaksi
* User bisa edit sebelum save
* Data tersimpan ke Supabase
* Dashboard update realtime
* UX smooth di mobile

```
```
