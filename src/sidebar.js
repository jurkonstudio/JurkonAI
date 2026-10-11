// Drawer mobile: buka/tutup, scrim, tombol Escape.
const $ = id => document.getElementById(id);
export const openNav = () => { $('app').classList.add('open'); $('scrim').hidden = false; };
export const closeNav = () => { $('app').classList.remove('open'); $('scrim').hidden = true; };
export function initSidebar() {
  $('menu').onclick = openNav; $('scrim').onclick = closeNav;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
}
