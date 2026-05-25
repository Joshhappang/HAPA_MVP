export function TemplateCard({ preview, title, onClick }) {
  const el = document.createElement('div');

  el.className = 'hapa-card hapa-template-card';

  el.innerHTML = `
    <div class="preview">
      <img src="${preview}" />
    </div>
    <div class="title">${title}</div>
  `;

  el.addEventListener('click', onClick);

  return el;
}
