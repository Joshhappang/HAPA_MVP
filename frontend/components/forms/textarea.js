export function Textarea({ placeholder, value = '', onChange }) {
  const el = document.createElement('textarea');

  el.placeholder = placeholder;
  el.value = value;

  el.addEventListener('input', (e) => {
    onChange?.(e.target.value);
  });

  return el;
}
