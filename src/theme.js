export function applyPrefs(prefs) {
  const r = document.documentElement;
  r.dataset.theme = prefs.theme; r.style.setProperty('--fs', prefs.fontsize + 'px');
  document.getElementById('theme').value = prefs.theme; document.getElementById('fontsize').value = prefs.fontsize;
}
