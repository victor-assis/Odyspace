async function loadComponent(selector, url) {
  const container = document.querySelector(selector);

  if (container) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      container.innerHTML = html;
    } catch (error) {
      console.error(`Error loading ${url}:`, error);
      container.innerHTML = `<p>Error loading content.</p>`;
    }
  }
}

export async function loadComponents() {
  await Promise.all([
    loadComponent('#header', './shared/components/header.html'),
    loadComponent('#footer', './shared/components/footer.html'),
    loadComponent('#aside', './shared/components/aside.html'),
  ]);
}

export { loadComponent };
