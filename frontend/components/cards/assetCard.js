export function AssetCard({ src, name, onClick }) {
  const el = document.createElement('div');

  el.className = 'hapa-card hapa-asset-card';

  el.innerHTML = `
    <img src="${src}" />
    <div class="name">${name}</div>
  `;

  el.addEventListener('click', onClick);

  return el;
}
