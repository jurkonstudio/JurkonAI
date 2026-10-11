# Arsitektur Jurkon AI (Tahap 2)
Situs statis, ES Modules, tanpa build. Semua path relatif (aman di subpath GitHub Pages).

## Modul
| Modul | Tanggung jawab |
|---|---|
| `src/app.js` | Merangkai DOM, event, dan subscribe ke state. Tanpa logika bisnis. |
| `core/config.js` | Konstanta: kunci storage, batas, saran prompt. |
| `core/state.js` | Objek `state`, `subscribe`, `emit`. |
| `chat/chatController.js` | Satu-satunya pengubah state: chat baru, kirim, ganti nama, hapus. |
| `chat/chatStorage.js` | localStorage + validasi/normalisasi (`sanitize`). |
| `chat/aiService.js` | **Mock** AI. Antarmuka: `reply(messages) -> {text, simulated}`. |
| `chat/messageRenderer.js` | Render riwayat dan pesan ke DOM. |
| `ui/*` | Sidebar/drawer, tema, pengaturan, notifikasi. |
| `utils/*` | `dom.el` (aman), `markdown`, `clipboard`. |

Arah impor: `app → ui/chat → core/utils`. Tidak ada siklus (diperiksa dengan skrip).

## Alur kirim pesan
Enter/tombol/kartu saran → `chat.send` → abaikan jika kosong atau `pending` → tambah pesan user → `pending=true`, simpan, `emit` → `AIService.reply` → tambah balasan (atau pesan error) → `pending=false`, simpan, `emit` → renderer menggambar ulang.

## Percakapan
`newChat` memakai ulang percakapan kosong yang ada. Judul otomatis dari pesan pertama (40 karakter); `rename` membatasi 60 karakter. `remove` menghapus percakapan aktif; `clearHistory` menghapus semua.

## Penyimpanan
Kunci `jurkon.v1` berisi `{conversations, prefs}`. Saat dimuat, `sanitize` membuang entri tidak valid, memotong teks, dan mengembalikan default jika JSON rusak. Data **tidak terenkripsi**, hanya di browser ini, dan bisa dihapus pengguna/browser. Ini bukan sinkronisasi cloud.

## Error & duplikasi
Gagal simpan → toast. Gagal balasan → pesan error di chat. Duplikasi dicegah oleh `state.pending`, dan tombol kirim dinonaktifkan.

## Batas simulasi vs AI nyata
Hanya `aiService.js` yang perlu diganti pada Tahap 3 untuk memanggil backend aman. Frontend tidak boleh memuat API key.
