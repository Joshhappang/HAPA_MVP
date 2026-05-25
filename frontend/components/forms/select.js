export function Select({ options = [], value, onChange }) {
  const el = document.createElement('select');

  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    el.appendChild(o);
  });

  el.value = value;

  el.addEventListener('change', (e) => {
    onChange?.(e.target.value);
  });

  return el;
}
