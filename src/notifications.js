let timer;
export function notify(message, type = 'info') {
  const e = document.getElementById('toast'); if (!e) return;
  e.textContent = message; e.dataset.type = type; e.classList.add('show');
  clearTimeout(timer); timer = setTimeout(() => e.classList.remove('show'), 2200);
}
