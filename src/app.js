import { state, subscribe } from './core/state.js';
import { SUGGESTIONS } from './core/config.js';
import * as chat from './chat/chatController.js';
import { renderHistory, renderChat } from './chat/messageRenderer.js';
import { copyText } from './utils/clipboard.js';
import { el } from './utils/dom.js';
import { notify } from './ui/notifications.js';
import { applyPrefs } from './ui/theme.js';
import { hydrateIcons, icon } from './ui/icons.js';
import { openMenu } from './ui/menu.js';
import { initSidebar, closeNav } from './ui/sidebar.js';
import { initSettings } from './ui/settings.js';
const $ = id => document.getElementById(id);
const safe = (name, fn) => { try { fn(); } catch (err) { console.error(`Jurkon: gagal pada ${name}`, err); } };
const onCopy = async t => { const ok = await copyText(t); notify(ok ? 'Tersalin' : 'Gagal menyalin. Pilih teks lalu salin manual.', ok ? 'info' : 'error'); return ok; };
const autosize = () => { const i = $('input'); i.style.height = 'auto'; i.style.height = Math.min(i.scrollHeight, 180) + 'px'; };
const syncSend = () => { const b = $('send'); b.disabled = state.pending || !$('input').value.trim(); b.dataset.loading = String(state.pending); };
const submit = () => { const t = $('input').value; if (!t.trim() || state.pending) return; $('input').value = ''; autosize(); chat.send(t); syncSend(); };
const askRename = id => { const c = state.conversations.find(x => x.id === id); if (c) chat.rename(prompt('Nama percakapan:', c.title), id); };
const askDelete = id => { const c = state.conversations.find(x => x.id === id); if (c && confirm(`Hapus "${c.title}"?`)) { chat.remove(id); notify('Percakapan dihapus'); } };
const onMenu = (id, anchor) => openMenu(anchor, [
  { label: 'Ubah nama', icon: 'edit', onClick: () => askRename(id) },
  { label: 'Hapus', icon: 'trash', danger: true, onClick: () => askDelete(id) }]);

hydrateIcons();
SUGGESTIONS.forEach(t => { const b = el('button', '', t); b.type = 'button'; b.onclick = () => { $('input').value = t; autosize(); syncSend(); $('input').focus(); }; $('suggest').append(b); });
subscribe(s => {
  safe('riwayat', () => renderHistory($('history'), s, { onSelect: id => { chat.select(id); closeNav(); }, onMenu }));
  safe('chat', () => renderChat($('chat'), s, { onCopy }));
  safe('header', () => { const c = chat.active(), home = !(c && c.messages.length); $('title').textContent = c ? c.title : 'Jurkon AI'; $('main').dataset.view = home ? 'home' : 'chat'; $('suggest').hidden = !home; });
  safe('input', syncSend);
  safe('tema', () => applyPrefs(s.prefs));
});
initSidebar();
const openSettings = initSettings({ onTheme: v => chat.setPref('theme', v), onFontsize: v => chat.setPref('fontsize', v), onClear: () => { chat.clearHistory(); $('settings').close(); notify('Riwayat dihapus'); } });
$('form').onsubmit = e => { e.preventDefault(); submit(); };
$('input').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); } });
$('input').addEventListener('input', () => { autosize(); syncSend(); });
const startNew = () => { chat.newChat(); closeNav(); $('input').focus(); };
$('newChat').onclick = startNew; $('newChatTop').onclick = startNew;
$('search').oninput = e => chat.setQuery(e.target.value);
$('openSettings').onclick = () => { closeNav(); openSettings(); };
safe('inisialisasi', () => chat.init());
window.__jurkonReady = true;
