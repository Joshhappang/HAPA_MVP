export function IconButton({ icon, onClick }) {
  const btn = document.createElement('button');

  btn.className = 'hapa-btn hapa-btn-icon';

  btn.innerHTML = `<i class="${icon}"></i>`;

  btn.addEventListener('click', onClick);

  return btn;
}
