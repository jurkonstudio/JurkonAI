# Jurkon AI — Tahap 2
Antarmuka AI statis. **Balasan hanya simulasi** (`src/chat/aiService.js`); tidak ada model nyata, akun, atau cloud.

Fitur: chat baru, kirim via tombol/Enter (Shift+Enter baris baru), riwayat (cari, ganti nama, hapus), salin pesan/kode, Markdown aman tanpa innerHTML, tema gelap/terang, ukuran teks, hapus semua riwayat, localStorage (`jurkon.v1`, tidak terenkripsi, hanya di browser ini).

## Lokal
`python3 -m http.server 8000` → http://localhost:8000. Tes logika: `node tests/logic.test.mjs`.

## GitHub Pages
Push isi folder ke `main` → Settings → Pages → Deploy from a branch → `main` / `(root)` → buka `https://<user>.github.io/<repo>/`.

## Struktur yang WAJIB ada di root repo (huruf kecil, persis)
`index.html`, `manifest.webmanifest`, `.nojekyll`, `assets/`, `styles/`, `src/`, `docs/`, `tests/`. Folder `asset`, `style`, `css`, `js` dan file lepas `TEST_PLAN.md`/`logic.test.mjs` di root adalah sisa lama dan tidak dipakai.

## Dokumen
`docs/ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `ROADMAP.md`, `TECHNICAL_DECISIONS.md`, `tests/TEST_PLAN.md`.

## Keterbatasan
UI belum diuji di browser/perangkat nyata; ikon header berupa karakter teks; drawer belum punya focus trap; Markdown terbatas; AI nyata butuh backend aman.
