import { state, subscribe } from './core/state.js';
import * as chat from './chat/chatController.js';
import { renderHistory, renderChat } from './chat/messageRenderer.js';
import { copyText } from './utils/clipboard.js';
import { notify } from './ui/notifications.js';
import { applyPrefs } from './ui/theme.js';
import { initSidebar, closeNav } from './ui/sidebar.js';
import { initSettings } from './ui/settings.js';
const $ = id => document.getElementById(id);
const onCopy = async t => notify((await copyText(t)) ? 'Tersalin' : 'Gagal menyalin. Pilih teks lalu salin manual.', 'info');
const autosize = () => { const i = $('input'); i.style.height = 'auto'; i.style.height = Math.min(i.scrollHeight, 160) + 'px'; };
const submit = () => { const t = $('input').value; if (t.trim() && !state.pending) { $('input').value = ''; autosize(); } chat.send(t); };

// Tiap bagian dibungkus terpisah: kegagalan satu komponen tidak menghentikan yang lain.
const safe = (name, fn) => { try { fn(); } catch (err) { console.error(`Jurkon: gagal merender ${name}`, err); } };
subscribe(s => {
  safe('riwayat', () => renderHistory($('history'), s, id => { chat.select(id); closeNav(); }));
  safe('chat', () => renderChat($('chat'), s, { onSuggest: chat.send, onCopy }));
  safe('header', () => { const c = chat.active(); $('title').textContent = c ? c.title : 'Jurkon AI'; $('send').disabled = s.pending; });
  safe('tema', () => applyPrefs(s.prefs));
});
initSidebar();
const openSettings = initSettings({ onTheme: v => chat.setPref('theme', v), onFontsize: v => chat.setPref('fontsize', v), onClear: () => { chat.clearHistory(); notify('Riwayat dihapus'); } });
$('form').onsubmit = e => { e.preventDefault(); submit(); };
$('input').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); } });
$('input').addEventListener('input', autosize);
$('newChat').onclick = () => { chat.newChat(); closeNav(); $('input').focus(); };
$('search').oninput = e => chat.setQuery(e.target.value);
$('rename').onclick = () => { const c = chat.active(); if (!c) return notify('Mulai percakapan dulu.'); chat.rename(prompt('Nama percakapan:', c.title)); };
$('delete').onclick = () => { const c = chat.active(); if (!c) return notify('Tidak ada percakapan dipilih.'); if (confirm(`Hapus "${c.title}"?`)) { chat.remove(); notify('Percakapan dihapus'); } };
$('openSettings').onclick = () => { closeNav(); openSettings(); };
safe('inisialisasi', () => chat.init());
window.__jurkonReady = true;
