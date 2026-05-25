export function GhostButton({ text, onClick }) {
  const btn = document.createElement('button');

  btn.className = 'hapa-btn hapa-btn-ghost';
  btn.innerText = text;

  btn.addEventListener('click', onClick);

  return btn;
}
