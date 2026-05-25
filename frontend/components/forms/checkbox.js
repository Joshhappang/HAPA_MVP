export function Checkbox({ label, checked = false, onChange }) {
  const wrapper = document.createElement('label');

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = checked;

  input.addEventListener('change', (e) => {
    onChange?.(e.target.checked);
  });

  wrapper.appendChild(input);
  wrapper.appendChild(document.createTextNode(label));

  return wrapper;
}
