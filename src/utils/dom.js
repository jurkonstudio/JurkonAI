// Pembuat elemen aman: teks selalu lewat textContent, tidak pernah innerHTML.
export function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
