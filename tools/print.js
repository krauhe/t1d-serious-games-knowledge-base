/** PDF-knappen bruger browserens egen udskrivning; ingen dokumenter sendes til en server. */
(function () {
  'use strict';
  const button = document.getElementById('save-pdf');
  if (!button) return;
  const includeStudies = document.getElementById('pdf-study-details');
  const status = document.getElementById('pdf-status');
  let previousDetails = null;

  // Print skal inkludere sammenfoldede profiler uden at ændre læserens skærmtilstand.
  // Gem den oprindelige tilstand én gang: nogle browsere sender beforeprint flere gange.
  function preparePrint() {
    if (!previousDetails) {
      previousDetails = [...document.querySelectorAll('main details')].map(detail => [detail, detail.open]);
    }
    document.body.classList.toggle('print-study-details', includeStudies.checked);
    previousDetails.forEach(([detail]) => { detail.open = true; });
  }

  function restoreScreen() {
    previousDetails?.forEach(([detail, open]) => { detail.open = open; });
    previousDetails = null;
    document.body.classList.remove('print-study-details');
  }

  window.addEventListener('beforeprint', preparePrint);
  window.addEventListener('afterprint', restoreScreen);
  button.addEventListener('click', async function () {
    if (typeof window.print !== 'function') {
      status.textContent = 'Use your browser’s Share or Print menu to save this reading edition as PDF.';
      return;
    }
    button.disabled = true;
    status.textContent = 'Preparing PDF layout…';
    try {
      // Vent på skrifter og de faktiske billeder, også når de hidtil har været skjult.
      // En tidsgrænse forhindrer, at ét ødelagt billede blokerer hele eksporten.
      await Promise.race([
        Promise.all([
          document.fonts?.ready,
          ...[...document.querySelectorAll('main img')].map(image => image.decode?.().catch(() => {}))
        ]),
        new Promise(resolve => window.setTimeout(resolve, 3000))
      ]);
      preparePrint();
      window.print();
      status.textContent = 'Choose Save as PDF in the print dialog. If no dialog opens, use your browser’s Share or Print menu.';
    } catch {
      restoreScreen();
      status.textContent = 'The print dialog could not open. Use your browser’s Share or Print menu instead.';
    } finally {
      // afterprint, ikke print()s returværdi, afgør hvornår skærmtilstanden gendannes.
      button.disabled = false;
    }
  });
}());
