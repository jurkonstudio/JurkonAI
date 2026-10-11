# Rencana Uji
**Sudah dijalankan (Node, `node tests/logic.test.mjs`): 11 lulus** — JSON rusak, skema salah, pesan tidak valid, fallback tema, pengiriman ganda dicegah, balasan simulasi, error, simpan/muat ulang, ganti nama, hapus percakapan, hapus semua. Juga: sintaks semua modul, resolusi impor, tanpa siklus, path di index.html valid.

**Belum dijalankan (butuh browser) — uji manual:**
- [ ] Muat dari URL GitHub Pages, konsol tanpa error
- [ ] Tema gelap/terang berpindah dan tersimpan setelah refresh
- [ ] Drawer mobile (lebar 320–375 px) buka/tutup, Escape menutup
- [ ] Kirim via tombol dan Enter; Shift+Enter baris baru
- [ ] Cari, ganti nama, hapus percakapan; hapus semua dengan konfirmasi
- [ ] Salin pesan dan kode (perlu HTTPS/localhost)
- [ ] Tidak ada overflow horizontal; keyboard layar tidak menutup input
- [ ] Isi `localStorage['jurkon.v1']` dengan `{rusak` lalu refresh: app tetap terbuka
