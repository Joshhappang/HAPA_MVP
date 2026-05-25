export function DangerButton({ text, onClick }) {
  const btn = document.createElement('button');

  btn.className = 'hapa-btn hapa-btn-danger';
  btn.innerText = text;

  btn.addEventListener('click', onClick);

  return btn;
}
