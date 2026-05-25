export function PanelCard({ title, children }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'hapa-card hapa-panel-card';

  const header = document.createElement('div');
  header.className = 'hapa-card-header';
  header.innerText = title;

  const body = document.createElement('div');
  body.className = 'hapa-card-body';

  if (typeof children === 'string') {
    body.innerHTML = children;
  } else {
    children.forEach((c) => body.appendChild(c));
  }

  wrapper.appendChild(header);
  wrapper.appendChild(body);

  return wrapper;
}
