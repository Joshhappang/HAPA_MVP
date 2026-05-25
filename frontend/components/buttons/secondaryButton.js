export function SecondaryButton({ text, onClick }) {
  const btn = document.createElement('button');

  btn.className = 'hapa-btn hapa-btn-secondary';
  btn.innerText = text;

  btn.addEventListener('click', onClick);

  return btn;
}
