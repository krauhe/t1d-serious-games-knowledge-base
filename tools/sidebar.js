/** Shared edge-docked navigation for the website and the offline tablet edition. */
(function () {
  'use strict';
  const button = document.querySelector('.menu-button');
  const sidebar = document.getElementById('site-sidebar');
  if (!button || !sidebar) return;
  const compact = window.matchMedia('(max-width: 1100px)');
  const key = 't1d-kb-navigation-open';
  let saved;
  // Some file:// and private-browser contexts deny storage; navigation still works.
  try { saved = window.localStorage.getItem(key); } catch { /* Use the viewport default. */ }
  let open = saved === null || saved === undefined ? !compact.matches : saved === 'true';

  function setOpen(value, persist = true) {
    open = value;
    if (!open && sidebar.contains(document.activeElement)) button.focus();
    document.body.classList.toggle('sidebar-collapsed', !open);
    sidebar.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Hide navigation menu' : 'Show navigation menu');
    button.textContent = open ? 'Hide menu ‹' : 'Menu ›';
    if (persist) {
      try { window.localStorage.setItem(key, String(open)); } catch { /* Storage is optional. */ }
    }
  }
  button.addEventListener('click', () => setOpen(!open));
  sidebar.addEventListener('click', event => {
    if (compact.matches && event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) { setOpen(false); button.focus(); }
  });
  document.addEventListener('click', event => {
    if (compact.matches && open && !sidebar.contains(event.target) && !button.contains(event.target)) setOpen(false);
  });
  // Avoid unexpectedly covering the article when a window becomes tablet-sized.
  compact.addEventListener?.('change', () => { if (compact.matches) setOpen(false, false); });
  setOpen(open, false);
}());
