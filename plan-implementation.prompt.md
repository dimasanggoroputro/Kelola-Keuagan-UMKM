Approve implementation plan, lanjut execute.

Architecture dan root-cause analysis sudah tepat:

- stale cached navigation shell
- duplicate auth initialization
- hydration mismatch/race
- leftover OAuth hash fragment

Tambahan refinement request:

1. Auth Loading Experience
   Splash/loading state jangan terasa blank.

Target:

- smooth
- premium
- lightweight

Gunakan:

- subtle logo
- shimmer/skeleton
- fade transition

Hindari:

- white flash
- sudden layout jump

2. Hash Cleanup Safety
   Saat cleanup URL menggunakan:
   window.history.replaceState(...)

Pastikan:

- query params penting tidak ikut hilang
- hanya membersihkan:
  - trailing #
  - OAuth token fragments

3. Service Worker Versioning
   Tambahkan cache versioning yang jelas.

Contoh:

- catetin-static-v2
- catetin-pages-v2

Agar old stale cache otomatis invalidated setelah deploy baru.

4. Navigation Request Strategy
   Setuju menggunakan:

- Network-First untuk HTML/navigation
- Cache-First untuk assets

Ini harus mengurangi:

- auth hydration mismatch
- guest/auth flash
- stale landing/dashboard state

5. Prevent Double Initialization
   Pastikan:

- auth listener hanya subscribe sekali
- realtime channel tidak duplicate
- migration/fetch tidak double-run

6. Verification Tambahan
   Test:

- login/logout cepat berulang
- buka app dari homescreen PWA
- offline → online transition
- multiple tabs
- mobile Chrome Android

Pastikan:

- tidak ada /#
- tidak perlu hard refresh
- auth UI langsung sinkron
- landing/dashboard tidak flicker
- PWA tetap cepat & stabil
