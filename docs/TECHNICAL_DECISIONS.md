# Keputusan Teknis
- **ES Modules tanpa bundler**: deploy mudah di GitHub Pages; konsekuensi: butuh server lokal, tidak ada minifikasi.
- **State sederhana (objek + subscribe)**: cukup untuk skala ini; render ulang penuh bisa dioptimalkan nanti.
- **Markdown buatan sendiri, output DOM**: menghindari innerHTML dan dependensi; fitur terbatas (paragraf, daftar, tebal, kode).
- **Kunci `jurkon.v1` dipertahankan**: data Tahap 1 tetap terbaca; `sanitize` menangani skema lama/rusak.
- **Mock AI terisolasi**: satu file diganti saat integrasi backend.
- **Tes logika di Node tanpa framework**: `tests/logic.test.mjs`; tes UI masih manual.
