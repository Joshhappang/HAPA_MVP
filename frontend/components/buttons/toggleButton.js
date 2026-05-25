export function ToggleButton({ text, initial = false, onChange }) {
  let state = initial;

  const btn = document.createElement('button');

  btn.className = 'hapa-btn hapa-btn-toggle';
  btn.innerText = text;

  const update = () => {
    btn.classList.toggle('active', state);
  };

  btn.addEventListener('click', () => {
    state = !state;
    update();
    onChange?.(state);
  });

  update();

  return btn;
}
