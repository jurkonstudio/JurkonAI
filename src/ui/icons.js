// Ikon inline SVG bergaya garis (original, tanpa dependensi). Dibuat via DOM, bukan innerHTML.
const P = {
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'], plus: ['M12 5v14', 'M5 12h14'],
  search: ['M4 11a7 7 0 1 0 14 0a7 7 0 1 0-14 0', 'M20 20l-3.5-3.5'],
  send: ['M12 19V5', 'M5 12l7-7 7 7'], x: ['M6 6l12 12', 'M18 6L6 18'], check: ['M5 12l5 5L20 7'],
  settings: ['M4 7h10', 'M18 7h2', 'M4 17h2', 'M10 17h10', 'M14 5v4', 'M6 15v4'],
  more: ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'], edit: ['M4 20h4L19 9l-4-4L4 16z'],
  trash: ['M4 7h16', 'M10 11v6', 'M14 11v6', 'M6 7l1 12h10l1-12', 'M9 7V4h6v3'],
  copy: ['M9 9h10v10H9z', 'M5 15V5h10'], info: ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0', 'M12 11v5', 'M12 8h.01']
};
export function icon(name) {
  const NS = 'http://www.w3.org/2000/svg', s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'i'); s.setAttribute('aria-hidden', 'true');
  if (name === 'more') s.setAttribute('stroke-width', '3');
  (P[name] || []).forEach(d => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); s.append(p); });
  return s;
}
export function hydrateIcons(root = document) { root.querySelectorAll('[data-icon]').forEach(n => n.replaceWith(icon(n.dataset.icon))); }
