export function PrimaryButton({ text, onClick }) {
  const btn = document.createElement('button');

  btn.className = 'hapa-btn hapa-btn-primary';
  btn.innerText = text;

  btn.addEventListener('click', onClick);

  return btn;
}
