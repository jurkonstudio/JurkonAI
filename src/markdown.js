import { el } from './dom.js';
// Mendukung: paragraf, daftar (- / *), **tebal**, `kode`, blok ```kode```. Output berupa node DOM.
function inline(parent, s) {
  s.split(/(`[^`]+`|\*\*[^*]+\*\*)/).forEach(p => {
    if (p.startsWith('`') && p.length > 1) parent.append(el('code', '', p.slice(1, -1)));
    else if (p.startsWith('**') && p.length > 3) parent.append(el('strong', '', p.slice(2, -2)));
    else parent.append(p);
  });
}
export function renderMarkdown(text, onCopyCode) {
  const root = el('div'); let ul = null;
  text.split(/(```[\s\S]*?```)/).forEach(part => {
    if (part.startsWith('```')) {
      const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '').trimEnd();
      const pre = el('pre'); pre.append(el('code', '', code));
      const b = el('button', 'copy', 'Salin kode'); b.type = 'button'; b.onclick = () => onCopyCode(code);
      pre.append(b); root.append(pre); ul = null; return;
    }
    part.split('\n').forEach(line => {
      if (/^[-*] /.test(line)) { if (!ul) { ul = el('ul'); root.append(ul); } const li = el('li'); inline(li, line.slice(2)); ul.append(li); }
      else if (line.trim()) { ul = null; const p = el('p'); inline(p, line); root.append(p); } else ul = null;
    });
  });
  return root;
}
