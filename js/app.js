(() => {
  'use strict';

  const page = document.body.dataset.page;
  const main = document.getElementById('main-content');
  const renderers = window.ValhanPageRenderers;

  if (!main || !renderers) return;

  const render = renderers[page];
  if (typeof render === 'function') {
    main.innerHTML = render();
  }
})();