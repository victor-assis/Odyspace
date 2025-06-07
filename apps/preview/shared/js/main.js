import { loadComponents } from './load-components.js';

import { render } from './render.js';
import { onLoadThemeToggle } from './theme-toggle.js';
import { onLoadAside } from './aside.js';

import '../../../../dist/tokens/core/tokens.css';
import '../../../../packages/styles/src/styles.scss';


window.onload = async () => {
  await loadComponents();
  onLoadAside();
  onLoadThemeToggle();

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.icons-gallery');
    if (item) {
      const text = item.querySelector('.name').innerText;
      navigator.clipboard.writeText(text).catch(err => {
        console.error('Erro ao copiar texto: ', err);
      });
    }
  });
};
window.addEventListener('hashchange', render);
render();