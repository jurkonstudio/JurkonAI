# Roadmap
0. **Pemulihan UI (selesai di kode)** — penyebab: nama folder repositori tidak cocok (`asset`/`style` vs `assets`/`styles`). Ditambah pesan pemulihan jika CSS/JS gagal dimuat.
1. **Stabilisasi UI** — uji di perangkat nyata, ikon SVG, perbaikan aksesibilitas (focus trap drawer).
2. **Integrasi AI** — ganti `aiService.js` dengan backend aman (tanpa API key di frontend), streaming.
3. **Pengelolaan percakapan** — ekspor/impor, pin, hapus per item dari sidebar.
4. **Keamanan** — CSP, rate limit di backend, autentikasi opsional, penyimpanan cloud opsional.
5. **Pengujian** — otomatisasi tes UI (Playwright), CI.
6. **Deployment** — pipeline, pemantauan, PWA/offline (service worker).
