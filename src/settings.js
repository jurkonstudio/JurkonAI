const $ = id => document.getElementById(id);
export function initSettings({ onTheme, onFontsize, onClear }) {
  $('closeSettings').onclick = () => $('settings').close();
  $('theme').onchange = e => onTheme(e.target.value);
  $('fontsize').onchange = e => onFontsize(e.target.value);
  $('clearAll').onclick = () => { if (confirm('Hapus semua percakapan di browser ini? Tindakan ini tidak bisa dibatalkan.')) onClear(); };
  return () => $('settings').showModal();
}
