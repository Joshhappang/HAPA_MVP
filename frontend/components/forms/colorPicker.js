export function ColorPicker({ value = '#ffffff', onChange }) {
  const el = document.createElement('input');

  el.type = 'color';
  el.value = value;

  el.addEventListener('input', (e) => {
    onChange?.(e.target.value);
  });

  return el;
}
