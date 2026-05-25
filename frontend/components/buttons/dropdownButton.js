export function DropdownButton({ text, items = [] }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'hapa-dropdown';

  const btn = document.createElement('button');
  btn.className = 'hapa-btn hapa-btn-secondary';
  btn.innerText = text;

  const menu = document.createElement('div');
  menu.className = 'hapa-dropdown-menu';

  items.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'hapa-dropdown-item';
    el.innerText = item.label;

    el.addEventListener('click', item.onClick);

    menu.appendChild(el);
  });

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  wrapper.appendChild(btn);
  wrapper.appendChild(menu);

  return wrapper;
}
