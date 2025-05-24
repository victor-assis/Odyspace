import './load-components.js';

import { render } from './render.js';
import { onLoadThemeToggle } from './theme-toggle.js';
import { onLoadAside } from './aside.js';

import '../../../../dist/tokens/core/tokens.css';
import '../../../../packages/styles/src/styles.scss';

window.addEventListener('hashchange', render());
render();

window.onload = async () => {
  onLoadAside();
  onLoadThemeToggle();

  fetch('README.md')
    .then(response => response.text())
    .then(result => {
      const mainContentElement = document.getElementById('ody-markerd');
      if (mainContentElement) {
        mainContentElement.innerHTML = marked.parse(result);
      }
    });
  loadComponentsPage(); // Add this call for the new functionality
}

// --- New code for components page ---
function loadComponentsPage() {
  const componentList = document.getElementById('component-list');
  const componentPreview = document.getElementById('component-preview');
  const componentDocs = document.getElementById('component-docs');

  // Only run if the component list element exists on the page
  if (!componentList) {
    return;
  }

  const componentDocFiles = ['typography.md', 'button.md'];
  const baseDocPath = 'content/components/'; // Relative to the preview app root

  componentDocFiles.forEach(docFile => {
    const listItem = document.createElement('li');
    // Derive name: "typography.md" -> "Typography"
    const componentName = docFile.replace('.md', '').replace(/^\w/, c => c.toUpperCase());
    listItem.textContent = componentName;
    listItem.style.cursor = 'pointer'; // Make it look clickable

    listItem.addEventListener('click', () => {
      const filePath = baseDocPath + docFile;
      fetch(filePath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
          }
          return response.text();
        })
        .then(markdownContent => {
          // Extract HTML snippet
          const htmlSnippetMatch = markdownContent.match(/```html\n([^`]+)\n```/);
          let htmlToPreview = '';
          if (htmlSnippetMatch && htmlSnippetMatch[1]) {
            htmlToPreview = htmlSnippetMatch[1];
          }

          if (componentPreview) {
            componentPreview.innerHTML = htmlToPreview;
          }

          if (componentDocs) {
            // Render full markdown (or markdown without the snippet)
            // For simplicity, rendering full markdown for now.
            componentDocs.innerHTML = marked.parse(markdownContent);
          }
        })
        .catch(error => {
          console.error('Error loading component:', error);
          if (componentPreview) componentPreview.innerHTML = '<p>Error loading preview.</p>';
          if (componentDocs) componentDocs.innerHTML = '<p>Error loading documentation.</p>';
        });
    });
    componentList.appendChild(listItem);
  });
}
// --- End of new code for components page ---