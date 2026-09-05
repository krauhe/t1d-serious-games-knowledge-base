/** Client-side navigation and local-file-compatible full-text search. */

(function () {
  'use strict';

  const menuButton = document.querySelector('.menu-button');
  const sidebar = document.getElementById('site-sidebar');
  const searchButton = document.querySelector('.search-button');
  const searchPanel = document.getElementById('search-panel');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.getElementById('site-search');
  const searchResults = document.getElementById('search-results');
  const rootPrefix = document.body.dataset.rootPrefix || '';
  const backgroundLayer = document.querySelector('.site-background');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let parallaxFrame = 0;

  function updateBackgroundPosition() {
    parallaxFrame = 0;
    if (!backgroundLayer || reducedMotion.matches) {
      document.documentElement.style.setProperty('--landscape-position', '0%');
      return;
    }

    const scrollableHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = Math.min(1, Math.max(0, window.scrollY / scrollableHeight));
    document.documentElement.style.setProperty('--landscape-position', `${(scrollProgress * 100).toFixed(3)}%`);
  }

  function requestBackgroundUpdate() {
    if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateBackgroundPosition);
  }

  window.addEventListener('scroll', requestBackgroundUpdate, { passive: true });
  window.addEventListener('resize', requestBackgroundUpdate);
  reducedMotion.addEventListener?.('change', requestBackgroundUpdate);
  updateBackgroundPosition();

  menuButton?.addEventListener('click', function () {
    const isOpen = document.body.classList.toggle('sidebar-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  function openSearch() {
    searchPanel.hidden = false;
    searchButton?.setAttribute('aria-expanded', 'true');
    window.setTimeout(() => searchInput?.focus(), 0);
  }

  function closeSearch() {
    searchPanel.hidden = true;
    searchButton?.setAttribute('aria-expanded', 'false');
  }

  searchButton?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  searchPanel?.addEventListener('click', event => {
    if (event.target === searchPanel) closeSearch();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !searchPanel?.hidden) closeSearch();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
  });

  searchInput?.addEventListener('input', function () {
    const terms = searchInput.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      searchResults.innerHTML = '<p>Enter one or more terms. Search covers the full local knowledge base.</p>';
      return;
    }

    const matches = (window.T1D_KB_SEARCH_INDEX || [])
      .map(entry => {
        const haystack = `${entry.title} ${entry.text}`.toLowerCase();
        const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
        return { ...entry, score };
      })
      .filter(entry => entry.score === terms.length)
      .slice(0, 20);

    searchResults.innerHTML = matches.length
      ? matches.map(entry => `<a href="${rootPrefix}${entry.url}"><strong>${escapeHtml(entry.title)}</strong><span>${escapeHtml(snippet(entry.text, terms[0]))}</span></a>`).join('')
      : '<p>No matching pages. Try a broader term.</p>';
  });

  function snippet(text, term) {
    const clean = String(text).replace(/\s+/g, ' ');
    const position = clean.toLowerCase().indexOf(term);
    const start = Math.max(0, position - 90);
    const end = Math.min(clean.length, start + 240);
    return `${start ? '…' : ''}${clean.slice(start, end)}${end < clean.length ? '…' : ''}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }
}());
