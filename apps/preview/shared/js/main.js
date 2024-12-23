import './load-components.js';

import { render } from './render.js';
import { onLoadThemeToggle } from './theme-toggle.js';
import { onLoadAside } from './aside.js';

import '../../../../dist/tokens/core/tokens.css';
import '../../../../packages/styles/src/styles.scss';


window.onload = async () => {
  onLoadAside();
  onLoadThemeToggle();

  document.querySelectorAll('.icons-gallery').forEach(item => {
    item.addEventListener('click', () => {
      const text = item.querySelector('.name').innerText;
      navigator.clipboard.writeText(text).then().catch(err => {
        console.error('Erro ao copiar texto: ', err);
      });
    });
  });
}
window.addEventListener('hashchange', render());
render();