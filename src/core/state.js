// Satu sumber kebenaran. Hanya chatController yang boleh mengubahnya, lalu memanggil emit().
import { DEFAULT_PREFS } from './config.js';
export const state = { conversations: [], prefs: { ...DEFAULT_PREFS }, activeId: null, pending: false, query: '', stick: false };
const listeners = new Set();
export const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn); };
export const emit = () => listeners.forEach(fn => fn(state));
