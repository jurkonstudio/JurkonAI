# Jurkon AI — Prototipe Tahap 1
Ruang kerja AI pribadi (frontend statis). **Balasan AI hanya simulasi** (`js/mockAI.js`); tidak ada model nyata, login, atau sinkronisasi cloud.

## Fitur
Chat baru, kirim via tombol/Enter (Shift+Enter = baris baru), riwayat & pencarian, ubah nama, salin pesan/kode, Markdown aman (tanpa innerHTML), tema gelap/terang, ukuran teks, hapus riwayat, penyimpanan localStorage berversi (`jurkon.v1`).

## Jalankan lokal
ES module butuh server: `python3 -m http.server 8000` lalu buka http://localhost:8000

## Deploy GitHub Pages
1. Push semua file ke branch `main`.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
3. Buka `https://<user>.github.io/<repo>/` (semua path relatif, aman di subpath).

## Batasan
Data hanya di browser ini dan bisa terhapus. AI nyata nanti butuh backend aman; jangan simpan API key di frontend. Ketik "error" untuk menguji tampilan galat, "kode" untuk menguji code block.
