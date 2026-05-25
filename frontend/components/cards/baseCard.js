export function BaseCard({ children }) {
  const el = document.createElement('div');

  el.className = 'hapa-card';

  if (typeof children === 'string') {
    el.innerHTML = children;
  } else {
    children.forEach((c) => el.appendChild(c));
  }

  return el;
}
