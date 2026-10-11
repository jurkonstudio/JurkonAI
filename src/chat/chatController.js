import { state, emit } from '../core/state.js';
import { LIMITS } from '../core/config.js';
import * as storage from './chatStorage.js';
import { AIService } from './aiService.js';
import { notify } from '../ui/notifications.js';
const uid = () => globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2);
export const active = () => state.conversations.find(c => c.id === state.activeId);
function persist() { if (!storage.save(state)) notify('Penyimpanan lokal tidak tersedia; data tidak akan tersimpan.', 'error'); }
export function init() { const d = storage.load(); state.conversations = d.conversations; state.prefs = d.prefs; emit(); }
export function newChat() {
  const blank = state.conversations.find(c => !c.messages.length);
  if (blank) state.activeId = blank.id;
  else { const c = { id: uid(), title: 'Percakapan baru', createdAt: Date.now(), messages: [] }; state.conversations.unshift(c); state.activeId = c.id; }
  state.stick = true; persist(); emit();
}
export function select(id) { state.activeId = id; state.stick = true; emit(); }
export function setQuery(q) { state.query = q; emit(); }
export function setPref(key, value) { state.prefs = { ...state.prefs, [key]: value }; persist(); emit(); }
export function rename(title, id = state.activeId) { const c = state.conversations.find(x => x.id === id), t = title?.trim(); if (!c || !t) return false; c.title = t.slice(0, LIMITS.title); persist(); emit(); return true; }
export function remove(id = state.activeId) { state.conversations = state.conversations.filter(c => c.id !== id); if (state.activeId === id) state.activeId = null; persist(); emit(); }
export function clearHistory() { storage.clearAll(); state.conversations = []; state.activeId = null; persist(); emit(); }
const NOTICE = 'Layanan AI belum terhubung. Pesanmu tersimpan di percakapan ini; balasan akan muncul setelah model dikonfigurasi.';
// state.pending mencegah pengiriman ganda (tombol, Enter).
export async function send(text) {
  text = (text ?? '').trim().slice(0, LIMITS.message);
  if (!text || state.pending) return;
  if (!active()) newChat();
  const c = active();
  if (!c.messages.length) c.title = text.slice(0, 40);
  c.messages.push({ id: uid(), role: 'user', text, at: Date.now() });
  state.pending = true; state.stick = true; persist(); emit();
  try {
    const r = await AIService.reply(c.messages.filter(m => m.role !== 'notice'));
    c.messages.push({ id: uid(), role: 'assistant', text: r.text, at: Date.now() });
  } catch (e) {
    if (e.code === 'NOT_CONFIGURED') {
      // Satu pemberitahuan per percakapan; selanjutnya cukup toast singkat.
      if (!c.messages.some(m => m.role === 'notice')) c.messages.push({ id: uid(), role: 'notice', text: NOTICE, at: Date.now() });
      else notify('Layanan AI belum terhubung.');
    } else console.error('Jurkon: gagal memanggil layanan AI', e), c.messages.push({ id: uid(), role: 'assistant', text: 'Balasan gagal diambil. Coba kirim ulang.', error: true, at: Date.now() });
  }
  state.pending = false; state.stick = true; persist(); emit();
}
