/** Filter, sort and expand catalogue rows; identical code is embedded in both editions. */
(function () {
  'use strict';
  const table = document.getElementById('game-table');
  if (!table) return;
  const entries = [...table.querySelectorAll('.game-entry')];
  const search = document.getElementById('game-search');
  const controls = ['availability', 'evidence', 'platform', 'language'].map(key => document.getElementById(key + '-filter'));
  let sortKey = 'title';
  let direction = 1;

  // Et manglende eller beskadiget billede må ikke efterlade en tom ramme.
  // Kildelinket bevares i produktets almindelige linkrække. Capture er nødvendigt,
  // fordi billeders error-hændelser ikke bobler; cachede fejl kontrolleres også.
  function removeFailedImage(image) {
    if (image?.tagName === 'IMG') image.closest('.game-figure')?.remove();
  }
  table.addEventListener('error', event => removeFailedImage(event.target), true);
  table.querySelectorAll('.game-figure img').forEach(image => {
    if (image.complete && image.naturalWidth === 0) removeFailedImage(image);
  });

  function filter() {
    const terms = search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const row of entries) {
      const matches = terms.every(term => row.dataset.search.includes(term)) && controls.every(control => {
        const key = control.id.replace('-filter', '');
        const values = key === 'platform' || key === 'language' ? row.dataset[key + 's'].split('|') : [row.dataset[key]];
        return !control.value || values.includes(control.value);
      });
      row.hidden = !matches;
      visible += Number(matches);
    }
    document.getElementById('game-result-count').textContent = visible + ' of ' + entries.length + ' games shown';
    document.getElementById('catalogue-empty').hidden = visible !== 0;
  }

  function expand(row, open) {
    row.querySelector('.game-toggle').setAttribute('aria-expanded', String(open));
    row.querySelector('.game-toggle .facet-detail').textContent = open ? 'Close details −' : 'Description & sources +';
    row.querySelector('.game-detail-row').hidden = !open;
  }

  function sort() {
    entries.sort((a,b) => {
      // Unknown release dates stay at the end in both directions.
      if (sortKey === 'year') {
        if (!a.dataset.year || !b.dataset.year) return a.dataset.year ? -1 : b.dataset.year ? 1 : a.dataset.title.localeCompare(b.dataset.title);
        return (Number(a.dataset.year) - Number(b.dataset.year)) * direction || a.dataset.title.localeCompare(b.dataset.title);
      }
      return a.dataset[sortKey].localeCompare(b.dataset[sortKey]) * direction || a.dataset.title.localeCompare(b.dataset.title);
    });
    entries.forEach(row => table.append(row));
    table.querySelectorAll('[data-sort]').forEach(button => {
      const active = button.dataset.sort === sortKey;
      button.closest('th').setAttribute('aria-sort', active ? (direction === 1 ? 'ascending' : 'descending') : 'none');
      button.querySelector('span').textContent = active ? (direction === 1 ? ' ↑' : ' ↓') : ' ↕';
    });
  }

  table.addEventListener('click', event => {
    const toggle = event.target.closest('.game-toggle');
    if (toggle) expand(toggle.closest('.game-entry'), toggle.getAttribute('aria-expanded') !== 'true');
    const sortButton = event.target.closest('[data-sort]');
    if (sortButton) {
      direction = sortKey === sortButton.dataset.sort ? -direction : 1;
      sortKey = sortButton.dataset.sort;
      sort();
    }
  });
  [search, ...controls].forEach(control => control.addEventListener('input', filter));
  document.getElementById('catalogue-reset').addEventListener('click', () => {
    [search, ...controls].forEach(control => { control.value = ''; });
    filter();
  });

  function openLinkedGame() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const row = entries.find(entry => entry.id === id);
    if (!row) return;
    // A direct link must remain reachable even after the reader has filtered it out.
    [search, ...controls].forEach(control => { control.value = ''; });
    filter();
    expand(row, true);
    row.scrollIntoView({ block: 'start' });
  }
  window.addEventListener('hashchange', openLinkedGame);
  filter();
  openLinkedGame();
}());
