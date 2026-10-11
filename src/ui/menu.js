import { el } from '../utils/dom.js';
import { icon } from './icons.js';
let pop = null;
export function closeMenu() { if (pop) { pop.anchor?.setAttribute('aria-expanded', 'false'); pop.node.remove(); pop = null; } }
// Menu kecil kontekstual (ganti nama / hapus). Tertutup oleh klik di luar atau Escape.
export function openMenu(anchor, items) {
  closeMenu();
  const node = el('div', 'pop'); node.setAttribute('role', 'menu');
  items.forEach(it => { const b = el('button', it.danger ? 'danger' : ''); b.type = 'button'; b.setAttribute('role', 'menuitem'); b.append(icon(it.icon), it.label); b.onclick = () => { closeMenu(); it.onClick(); }; node.append(b); });
  document.body.append(node);
  const r = anchor.getBoundingClientRect(), w = node.offsetWidth, h = node.offsetHeight;
  node.style.left = Math.max(8, Math.min(r.right - w, innerWidth - w - 8)) + 'px';
  node.style.top = Math.max(8, Math.min(r.bottom + 4, innerHeight - h - 8)) + 'px';
  anchor.setAttribute('aria-expanded', 'true'); pop = { node, anchor }; node.querySelector('button').focus();
}
document.addEventListener('pointerdown', e => { if (pop && !pop.node.contains(e.target) && e.target !== pop.anchor) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && pop) { const a = pop.anchor; closeMenu(); a?.focus(); } });
