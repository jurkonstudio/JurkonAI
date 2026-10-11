import { el } from '../utils/dom.js';
import { renderMarkdown } from '../utils/markdown.js';
import { icon } from '../ui/icons.js';

export function renderHistory(root, state, { onSelect, onMenu }) {
  root.replaceChildren();
  const q = state.query.toLowerCase();
  const list = state.conversations.filter(c => !q || c.title.toLowerCase().includes(q) || c.messages.some(m => m.text.toLowerCase().includes(q)));
  if (!list.length) root.append(el('p', 'empty-h', state.conversations.length ? 'Tidak ada hasil.' : 'Percakapanmu akan muncul di sini.'));
  list.forEach(c => {
    const row = el('div', 'hrow' + (c.id === state.activeId ? ' on' : ''));
    const b = el('button', 'hitem', c.title); b.type = 'button'; b.title = c.title;
    if (c.id === state.activeId) b.setAttribute('aria-current', 'true');
    b.onclick = () => onSelect(c.id);
    const m = el('button', 'icon hmore'); m.type = 'button'; m.setAttribute('aria-label', `Menu untuk ${c.title}`); m.setAttribute('aria-haspopup', 'menu'); m.setAttribute('aria-expanded', 'false'); m.append(icon('more'));
    m.onclick = () => onMenu(c.id, m);
    row.append(b, m); root.append(row);
  });
}
// Tombol salin dengan umpan balik: ikon berubah jadi centang sebentar.
function copyButton(label, text, onCopy) {
  const b = el('button', 'icon'); b.type = 'button'; b.setAttribute('aria-label', label); b.append(icon('copy'));
  b.onclick = async () => { if (await onCopy(text)) { b.replaceChildren(icon('check')); setTimeout(() => b.replaceChildren(icon('copy')), 1400); } };
  return b;
}
export function renderChat(root, state, { onCopy }) {
  const c = state.conversations.find(x => x.id === state.activeId);
  // Jangan menyeret scroll jika pengguna sedang membaca pesan lama.
  const nearEnd = root.scrollHeight - root.scrollTop - root.clientHeight < 120;
  root.replaceChildren();
  if (!c || !c.messages.length) {
    const hero = el('div', 'hero'), tile = el('span', 'tile lg'), img = el('img'); img.src = 'assets/logo.png'; img.alt = 'Logo Jurkon AI'; img.width = 72; img.height = 72; tile.append(img);
    hero.append(tile, el('h2', '', 'Ruang untuk berpikir lebih jauh.'), el('p', '', 'Mulai dengan pertanyaan, ide, atau masalah yang ingin kamu selesaikan.'));
    root.append(hero); return;
  }
  c.messages.forEach(m => {
    if (m.role === 'notice') { const n = el('div', 'notice'); n.setAttribute('role', 'status'); n.append(icon('info'), el('span', '', m.text)); root.append(n); return; }
    const w = el('div', `msg ${m.role}${m.error ? ' error' : ''}`);
    if (m.role === 'user') { w.append(el('div', 'bubble', m.text)); }
    else {
      const body = el('div', 'content'); body.append(m.error ? el('p', '', m.text) : renderMarkdown(m.text, onCopy));
      w.append(body);
      if (m.simulated) w.append(el('span', 'legacy', 'Respons simulasi dari prototipe lama'));
      const acts = el('div', 'msg-actions'); acts.append(copyButton('Salin pesan', m.text, onCopy)); w.append(acts);
    }
    root.append(w);
  });
  if (state.stick || nearEnd) root.scrollTop = root.scrollHeight;
  state.stick = false;
}
