import * as store from './storage.js';
import { MockAIService as ai } from './mockAI.js';
const $ = id => document.getElementById(id);
const state = { ...store.load(), activeId: null, pending: false, q: '' };
const uid = () => (crypto.randomUUID?.() ?? Date.now() + Math.random().toString(16).slice(2));
const persist = () => { if (!store.save({ conversations: state.conversations, prefs: state.prefs })) toast('Penyimpanan lokal tidak tersedia; data tidak akan tersimpan.'); };
const active = () => state.conversations.find(c => c.id === state.activeId);
let tt; function toast(t) { const e = $('toast'); e.textContent = t; e.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => e.classList.remove('show'), 2000); }
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
async function copy(t) { try { await navigator.clipboard.writeText(t); toast('Tersalin'); } catch { toast('Gagal menyalin. Pilih teks lalu salin manual.'); } }

// Markdown aman: hanya membangun node DOM lewat textContent.
function inline(parent, s) {
  s.split(/(`[^`]+`|\*\*[^*]+\*\*)/).forEach(p => {
    if (p.startsWith('`') && p.length > 1) parent.append(el('code', '', p.slice(1, -1)));
    else if (p.startsWith('**') && p.length > 3) parent.append(el('strong', '', p.slice(2, -2)));
    else parent.append(p);
  });
}
function markdown(text) {
  const root = el('div'); let ul = null;
  text.split(/(```[\s\S]*?```)/).forEach(part => {
    if (part.startsWith('```')) {
      const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '').trimEnd();
      const pre = el('pre'); pre.append(el('code', '', code));
      const b = el('button', 'copy', 'Salin kode'); b.type = 'button'; b.onclick = () => copy(code);
      pre.append(b); root.append(pre); ul = null; return;
    }
    part.split('\n').forEach(line => {
      if (/^[-*] /.test(line)) { if (!ul) { ul = el('ul'); root.append(ul); } const li = el('li'); inline(li, line.slice(2)); ul.append(li); }
      else if (line.trim()) { ul = null; const p = el('p'); inline(p, line); root.append(p); } else ul = null;
    });
  });
  return root;
}
const SUGGEST = [['Menulis', 'Bantu tulis email profesional'], ['Belajar', 'Jelaskan konsep rekursi dengan sederhana'], ['Coding', 'Tulis kode JS untuk membalik string'], ['Brainstorming', 'Beri 5 ide nama proyek hobi']];

function renderHistory() {
  const h = $('history'); h.replaceChildren();
  const q = state.q.toLowerCase();
  const list = state.conversations.filter(c => !q || c.title.toLowerCase().includes(q) || c.messages.some(m => m.text.toLowerCase().includes(q)));
  if (!list.length) h.append(el('p', 'empty-h', state.conversations.length ? 'Tidak ada hasil.' : 'Belum ada percakapan. Mulai dengan chat baru.'));
  list.forEach(c => { const b = el('button', 'hitem', c.title); b.type = 'button'; b.setAttribute('aria-current', c.id === state.activeId); b.onclick = () => { state.activeId = c.id; closeNav(); render(); }; h.append(b); });
}
function renderChat() {
  const chat = $('chat'), c = active(); chat.replaceChildren();
  $('title').textContent = c ? c.title : 'Jurkon AI';
  if (!c || !c.messages.length) {
    const hero = el('div', 'hero'); const img = el('img'); img.src = 'assets/logo.png'; img.alt = 'Logo Jurkon AI';
    hero.append(img, el('h2', '', 'Your ideas. Your intelligence.'), el('p', '', 'Ruang kerja AI pribadi untuk berpikir, belajar, menulis, dan membangun ide.'));
    const cards = el('div', 'cards');
    SUGGEST.forEach(([t, p]) => { const b = el('button', 'card'); b.type = 'button'; b.append(el('b', '', t), el('span', '', p)); b.onclick = () => send(p); cards.append(b); });
    hero.append(cards); chat.append(hero); return;
  }
  c.messages.forEach(m => {
    const w = el('div', 'msg ' + m.role); w.append(el('span', 'who', m.role === 'user' ? 'Kamu' : 'Jurkon AI (simulasi)'));
    const b = el('div', 'bubble');
    if (m.error) b.append(el('p', 'err', m.text));
    else { if (m.simulated) b.append(el('span', 'badge', 'Respons simulasi')); b.append(m.role === 'user' ? el('p', '', m.text) : markdown(m.text)); }
    w.append(b); const cp = el('button', 'copy', 'Salin'); cp.type = 'button'; cp.onclick = () => copy(m.text); w.append(cp); chat.append(w);
  });
  if (state.pending) { const w = el('div', 'msg assistant'); const d = el('div', 'bubble dots'); d.setAttribute('aria-label', 'Jurkon AI sedang membalas'); d.append(el('span'), el('span'), el('span')); w.append(d); chat.append(w); }
  chat.scrollTop = chat.scrollHeight;
}
function render() { renderHistory(); renderChat(); $('send').disabled = state.pending; }

function newChat() {
  const c = state.conversations.find(x => !x.messages.length);
  if (c) state.activeId = c.id; else { const n = { id: uid(), title: 'Percakapan baru', createdAt: Date.now(), messages: [] }; state.conversations.unshift(n); state.activeId = n.id; }
  persist(); closeNav(); render(); $('input').focus();
}
async function send(text) {
  text = text.trim(); if (!text || state.pending) return;
  if (!active()) newChat();
  const c = active();
  if (!c.messages.length) c.title = text.slice(0, 40);
  c.messages.push({ id: uid(), role: 'user', text, at: Date.now() });
  $('input').value = ''; autosize(); state.pending = true; persist(); render();
  try {
    const r = await ai.reply(c.messages);
    c.messages.push({ id: uid(), role: 'assistant', text: r.text, simulated: r.simulated, at: Date.now() });
  } catch (e) {
    c.messages.push({ id: uid(), role: 'assistant', text: e.message || 'Terjadi kesalahan. Coba kirim ulang.', error: true, at: Date.now() });
  }
  state.pending = false; persist(); render();
}
const autosize = () => { const i = $('input'); i.style.height = 'auto'; i.style.height = Math.min(i.scrollHeight, 160) + 'px'; };
const openNav = () => { $('app').classList.add('open'); $('scrim').hidden = false; };
function closeNav() { $('app').classList.remove('open'); $('scrim').hidden = true; }
function applyPrefs() { document.documentElement.dataset.theme = state.prefs.theme; document.documentElement.style.setProperty('--fs', state.prefs.fontsize + 'px'); $('theme').value = state.prefs.theme; $('fontsize').value = state.prefs.fontsize; }

$('form').onsubmit = e => { e.preventDefault(); send($('input').value); };
$('input').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send($('input').value); } });
$('input').addEventListener('input', autosize);
$('newChat').onclick = newChat; $('menu').onclick = openNav; $('scrim').onclick = closeNav;
$('search').oninput = e => { state.q = e.target.value; renderHistory(); };
$('rename').onclick = () => { const c = active(); if (!c) return toast('Mulai percakapan dulu.'); const n = prompt('Nama percakapan:', c.title); if (n?.trim()) { c.title = n.trim().slice(0, 60); persist(); render(); } };
$('openSettings').onclick = () => { closeNav(); $('settings').showModal(); };
$('closeSettings').onclick = () => $('settings').close();
$('theme').onchange = e => { state.prefs.theme = e.target.value; applyPrefs(); persist(); };
$('fontsize').onchange = e => { state.prefs.fontsize = e.target.value; applyPrefs(); persist(); };
$('clearAll').onclick = () => { if (confirm('Hapus semua percakapan di browser ini? Tindakan ini tidak bisa dibatalkan.')) { const prefs = state.prefs; store.clear(); state.conversations = []; state.activeId = null; state.prefs = prefs; persist(); render(); toast('Riwayat dihapus'); } };
applyPrefs(); render();
