import { render } from './render.js';

function navigate(path) {
  window.location.hash = path;
  render();
}

export function onLoadAside() {
  const route = window.location.hash.slice(1) || '/';

  document.querySelector(`.aside__link[href$="${route}"]`)?.classList.add('active');

  document.querySelectorAll('a[data-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      document.querySelector('[data-link].active')?.classList.remove('active');
      link.classList.add('active');
      document.querySelector('.aside').classList.toggle('open');

      navigate(link.getAttribute('href'));

      if (document.startViewTransition) {
        document.startViewTransition();
      }
    });
  });


  document.querySelector('#menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.aside').classList.toggle('open');
  });
}
