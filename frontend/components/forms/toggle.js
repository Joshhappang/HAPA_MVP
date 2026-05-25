export function Toggle({ label, value = false, onChange }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'hapa-toggle';

  const btn = document.createElement('button');
  btn.className = 'hapa-btn hapa-btn-secondary';

  let state = value;

  const render = () => {
    btn.textContent = state ? `${label}: ON` : `${label}: OFF`;
    btn.classList.toggle('active', state);
  };

  btn.addEventListener('click', () => {
    state = !state;
    render();
    onChange?.(state);
  });

  render();
  wrapper.appendChild(btn);

  return wrapper;
}
