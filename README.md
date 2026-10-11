# Jurkon AI
Ruang kerja AI pribadi. Antarmuka statis (HTML/CSS/ES Modules, tanpa build). **Layanan AI belum terhubung**: aplikasi tidak menghasilkan jawaban palsu; saat pesan dikirim, pesan tersimpan dan muncul satu pemberitahuan singkat.

Fitur: beranda dengan input utama dan saran prompt, chat baru, riwayat (cari, ubah nama, hapus lewat menu ⋯), Markdown aman (judul, daftar, kutipan, tabel, kode) dengan tombol salin, tema gelap/terang, ukuran teks, hapus semua riwayat, localStorage `jurkon.v1` (tidak terenkripsi, hanya di browser ini).

## Struktur WAJIB di root repo (huruf kecil, persis)
`index.html`, `cek.html`, `manifest.webmanifest`, `.nojekyll`, `assets/logo.png`, `styles/`, `src/`, `docs/`, `tests/`. Sisa lama (`asset`, `style`, `css`, `js`, `TEST_PLAN.md`/`logic.test.mjs` di root) tidak dipakai dan sebaiknya dihapus.

## Lokal
`python3 -m http.server 8000` lalu buka http://localhost:8000. Tes logika: `node tests/logic.test.mjs`.

## GitHub Pages
Settings → Pages → Deploy from a branch → `main` / `(root)`. Alamat: https://jurkonstudio.github.io/JurkonAI/ . Jika tampil pesan gagal-muat, buka `/cek.html` untuk melihat file yang hilang.

## Keterbatasan
Belum ada model AI/backend (butuh backend aman; jangan simpan API key di frontend). Rename memakai dialog bawaan browser. Belum diuji di perangkat fisik atau Safari/Firefox.
