// Penyimpanan lokal berversi. Semua error storage ditangani agar app tetap jalan.
const KEY = 'jurkon.v1';
const empty = () => ({ conversations: [], prefs: { theme: 'dark', fontsize: '15' } });
const valid = d => d && Array.isArray(d.conversations) && d.prefs && d.conversations.every(c =>
  c && typeof c.id === 'string' && typeof c.title === 'string' && Array.isArray(c.messages));
export function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); return valid(d) ? d : empty(); }
  catch { return empty(); }
}
export function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch { return false; }
}
export function clear() { try { localStorage.removeItem(KEY); } catch {} return empty(); }
