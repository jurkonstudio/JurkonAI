import { STORAGE_KEY, LIMITS, DEFAULT_PREFS } from '../core/config.js';
// localStorage TIDAK terenkripsi dan hanya ada di browser ini.
const str = (v, n) => String(v ?? '').slice(0, n);
function cleanMessage(m) {
  if (!m || typeof m.text !== 'string' || !['user', 'assistant', 'notice'].includes(m.role)) return null;
  return { id: str(m.id, 64) || String(Date.now()), role: m.role, text: m.text.slice(0, LIMITS.message), at: Number(m.at) || 0, simulated: !!m.simulated, error: !!m.error };
}
// Validasi + normalisasi: data rusak atau skema lama tidak membuat app gagal.
export function sanitize(d) {
  if (!d || typeof d !== 'object' || !Array.isArray(d.conversations)) return { conversations: [], prefs: { ...DEFAULT_PREFS } };
  const p = d.prefs || {};
  return {
    conversations: d.conversations.filter(c => c && typeof c.id === 'string').map(c => ({
      id: str(c.id, 64), title: str(c.title, LIMITS.title) || 'Percakapan', createdAt: Number(c.createdAt) || 0,
      messages: (Array.isArray(c.messages) ? c.messages : []).map(cleanMessage).filter(Boolean)
    })),
    prefs: { theme: p.theme === 'light' ? 'light' : 'dark', fontsize: ['17', '18'].includes(String(p.fontsize)) ? '18' : '16' }
  };
}
export function load() { try { return sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch { return sanitize(null); } }
export function save({ conversations, prefs }) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ conversations, prefs })); return true; } catch { return false; } }
export function clearAll() { try { localStorage.removeItem(STORAGE_KEY); return true; } catch { return false; } }
