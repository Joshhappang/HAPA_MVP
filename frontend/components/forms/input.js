export function Input({ placeholder, value = '', onChange }) {
  const el = document.createElement('input');

  el.type = 'text';
  el.placeholder = placeholder;
  el.value = value;

  el.addEventListener('input', (e) => {
    onChange?.(e.target.value);
  });

  return el;
}
