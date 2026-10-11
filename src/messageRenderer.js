import { el } from '../utils/dom.js';
import { renderMarkdown } from '../utils/markdown.js';
import { SUGGESTIONS } from '../core/config.js';
export function renderHistory(root, state, onSelect) {
  root.replaceChildren();
  const q = state.query.toLowerCase();
  const list = state.conversations.filter(c => !q || c.title.toLowerCase().includes(q) || c.messages.some(m => m.text.toLowerCase().includes(q)));
  if (!list.length) root.append(el('p', 'empty-h', state.conversations.length ? 'Tidak ada hasil.' : 'Belum ada percakapan. Mulai dengan chat baru.'));
  list.forEach(c => { const b = el('button', 'hitem', c.title); b.type = 'button'; b.setAttribute('aria-current', String(c.id === state.activeId)); b.onclick = () => onSelect(c.id); root.append(b); });
}
export function renderChat(root, state, { onSuggest, onCopy }) {
  const c = state.conversations.find(x => x.id === state.activeId);
  root.replaceChildren();
  if (!c || !c.messages.length) {
    const hero = el('div', 'hero'), img = el('img'); img.src = 'assets/logo.png'; img.alt = 'Logo Jurkon AI';
    hero.append(img, el('h2', '', 'Your ideas. Your intelligence.'), el('p', '', 'Ruang kerja AI pribadi untuk berpikir, belajar, menulis, dan membangun ide.'));
    const cards = el('div', 'cards');
    SUGGESTIONS.forEach(([t, p]) => { const b = el('button', 'card'); b.type = 'button'; b.append(el('b', '', t), el('span', '', p)); b.onclick = () => onSuggest(p); cards.append(b); });
    hero.append(cards); root.append(hero); return;
  }
  c.messages.forEach(m => {
    const w = el('div', 'msg ' + m.role); w.append(el('span', 'who', m.role === 'user' ? 'Kamu' : 'Jurkon AI (simulasi)'));
    const b = el('div', 'bubble');
    if (m.error) b.append(el('p', 'err', m.text));
    else { if (m.simulated) b.append(el('span', 'badge', 'Respons simulasi')); b.append(m.role === 'user' ? el('p', '', m.text) : renderMarkdown(m.text, onCopy)); }
    const cp = el('button', 'copy', 'Salin'); cp.type = 'button'; cp.onclick = () => onCopy(m.text);
    w.append(b, cp); root.append(w);
  });
  if (state.pending) { const w = el('div', 'msg assistant'), d = el('div', 'bubble dots'); d.setAttribute('aria-label', 'Jurkon AI sedang membalas'); d.append(el('span'), el('span'), el('span')); w.append(d); root.append(w); }
  root.scrollTop = root.scrollHeight;
}
