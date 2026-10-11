# Design System
Token ada di `styles/tokens.css`; urutan muat: tokens, base, layout, components, responsive.

**Warna (gelap):** bg `#0b0d14`, bg2 `#12151f`, surface `#171b28`, elevated `#1e2333`, teks `#f1f3fa`, teks2 `#b4b9cc`, muted `#7d839a`, aksen `#8f94ff` (hover `#a6aaff`), border `#2a2f44`, ok `#4cc38a`, warn `#e5b44b`, err `#ef6b73`, fokus `#b9bcff`.
**Warna (terang):** bg `#f6f7fb`, surface `#fff`, teks `#14172a`, aksen `#5a5fe0`, border `#d9dcea`. Ganti via `data-theme` pada `<html>`.
**Spasi:** 4/8/12/16/24 px (`--s1..--s5`). **Radius:** 10/16/24 (`--r-s/m/l`). **Tipografi:** font sistem; dasar 15 px (17 px mode besar); kode memakai monospace sistem. **Bayangan:** `--shadow` (modal, toast).

**Komponen:** tombol (`.btn`, `.primary`, `.danger`, `.ghost`) tinggi min 44 px; input chat auto-tinggi maks 160 px; bubble user berbingkai, bubble assistant tanpa latar; modal memakai `<dialog>`; toast `role=status`.
**Ikon/logo:** logo `assets/logo.png`; ikon header memakai karakter teks (bukan SVG) — batasan yang diketahui.
**Breakpoint:** 800 px; di bawahnya sidebar menjadi drawer dan kartu saran satu kolom.
**State:** fokus `:focus-visible` outline 2 px; hover mengubah latar; disabled opasitas .5; loading berupa tiga titik. Animasi dimatikan oleh `prefers-reduced-motion`.
