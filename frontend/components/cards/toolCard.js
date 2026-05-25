export function ToolCard({ icon, label, onClick }) {
  const el = document.createElement('div');

  el.className = 'hapa-card hapa-tool-card';

  el.innerHTML = `
    <div class="icon">${icon}</div>
    <div class="label">${label}</div>
  `;

  el.addEventListener('click', onClick);

  return el;
}
