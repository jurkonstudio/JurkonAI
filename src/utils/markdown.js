import { el } from './dom.js';
import { icon } from '../ui/icons.js';
// Markdown aman (output DOM): paragraf, judul (#), daftar, kutipan (>), tabel, **tebal**, `kode`, blok ```kode```.
function inline(parent, s) {
  s.split(/(`[^`]+`|\*\*[^*]+\*\*)/).forEach(p => {
    if (p.startsWith('`') && p.length > 1) parent.append(el('code', '', p.slice(1, -1)));
    else if (p.startsWith('**') && p.length > 3) parent.append(el('strong', '', p.slice(2, -2)));
    else parent.append(p);
  });
}
const cells = l => l.trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim());
function table(rows) {
  const wrap = el('div', 'table-wrap'), t = el('table'), head = el('tr');
  cells(rows[0]).forEach(c => { const th = el('th'); inline(th, c); head.append(th); });
  const thead = el('thead'); thead.append(head); const body = el('tbody');
  rows.slice(2).forEach(r => { const tr = el('tr'); cells(r).forEach(c => { const td = el('td'); inline(td, c); tr.append(td); }); body.append(tr); });
  t.append(thead, body); wrap.append(t); return wrap;
}
function blocks(root, text) {
  const L = text.split('\n'); let ul = null;
  for (let i = 0; i < L.length; i++) {
    const line = L[i];
    if (/^\|/.test(line) && /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/.test(L[i + 1] || '')) {
      const rows = []; while (i < L.length && /^\|/.test(L[i])) rows.push(L[i++]); i--; root.append(table(rows)); ul = null;
    } else if (/^>\s?/.test(line)) {
      const q = el('blockquote'), p = el('p'); const parts = []; while (i < L.length && /^>\s?/.test(L[i])) parts.push(L[i++].replace(/^>\s?/, '')); i--; inline(p, parts.join(' ')); q.append(p); root.append(q); ul = null;
    } else if (/^#{1,3}\s/.test(line)) {
      const lvl = line.match(/^#+/)[0].length; const h = el('h' + (lvl + 2)); inline(h, line.replace(/^#+\s/, '')); root.append(h); ul = null;
    } else if (/^[-*] /.test(line)) {
      if (!ul) { ul = el('ul'); root.append(ul); } const li = el('li'); inline(li, line.slice(2)); ul.append(li);
    } else if (line.trim()) { ul = null; const p = el('p'); inline(p, line); root.append(p); } else ul = null;
  }
}
export function renderMarkdown(text, onCopyCode) {
  const root = el('div');
  text.split(/(```[\s\S]*?```)/).forEach(part => {
    if (part.startsWith('```')) {
      const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '').trimEnd();
      const pre = el('pre'); pre.append(el('code', '', code));
      const b = el('button', 'icon'); b.type = 'button'; b.setAttribute('aria-label', 'Salin kode'); b.append(icon('copy'));
      b.onclick = async () => { if (await onCopyCode(code)) { b.replaceChildren(icon('check')); setTimeout(() => b.replaceChildren(icon('copy')), 1400); } };
      pre.append(b); root.append(pre);
    } else blocks(root, part);
  });
  return root;
}
