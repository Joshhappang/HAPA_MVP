export function Range({ min = 0, max = 100, value = 50, onChange }) {
  const el = document.createElement('input');

  el.type = 'range';
  el.min = min;
  el.max = max;
  el.value = value;

  el.addEventListener('input', (e) => {
    onChange?.(Number(e.target.value));
  });

  return el;
}
