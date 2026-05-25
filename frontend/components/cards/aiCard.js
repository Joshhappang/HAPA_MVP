export function AICard({ text, meta }) {
  const el = document.createElement('div');

  el.className = 'hapa-card hapa-ai-card ai-glow';

  el.innerHTML = `
    <div class="ai-text">${text}</div>
    <div class="ai-meta">${meta || ''}</div>
  `;

  return el;
}
