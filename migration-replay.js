const replay = document.querySelector('[data-replay]');
const steps = new Map([...replay.querySelectorAll('.replay-step')].map(step => [`#${step.id}`, step]));
let activeStep;

function showReplayStep(current, focusHeading) {
  activeStep = current;
  for (const step of steps.values()) step.hidden = step !== current;
  if (focusHeading) current.querySelector('h2').focus();
}

function citationStep() {
  return steps.get(history.state?.migrationReplayStep);
}

function syncCitationEntry() {
  const savedStep = citationStep();
  if (savedStep) {
    if (savedStep !== activeStep) showReplayStep(savedStep, false);
    return;
  }
  history.replaceState({ ...history.state, migrationReplayStep: `#${activeStep.id}` }, '');
}

replay.dataset.interactive = '';
const initialStep = steps.get(location.hash);
const initialCitation = location.hash === '#citation' ? citationStep() : undefined;
showReplayStep(initialStep ?? initialCitation ?? steps.get('#start'), Boolean(initialStep));

const runLink = steps.get('#start').querySelector('a[href="#timeout"]');
const runStatus = replay.querySelector('[data-run-status]');
let pendingRun;

function clearPendingRun() {
  clearTimeout(pendingRun);
  pendingRun = undefined;
  runLink.removeAttribute('aria-disabled');
  runStatus.textContent = '';
}

runLink.addEventListener('click', event => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (pendingRun !== undefined) return;
  const fromHash = location.hash;
  runLink.setAttribute('aria-disabled', 'true');
  runStatus.textContent = 'Waiting for confirmation…';
  pendingRun = setTimeout(() => {
    clearPendingRun();
    if (location.hash === fromHash) location.hash = runLink.hash;
  }, 750);
});

window.addEventListener('hashchange', () => {
  if (pendingRun !== undefined) clearPendingRun();
  if (location.hash === '#citation') {
    syncCitationEntry();
    return;
  }
  const current = steps.get(location.hash || '#start');
  if (current) showReplayStep(current, true);
});
// History traversal can revisit a citation entry without changing the fragment.
window.addEventListener('popstate', () => {
  if (location.hash === '#citation') syncCitationEntry();
});

const copyButton = document.querySelector('[data-copy-citation]');
const copyStatus = document.querySelector('[data-copy-status]');
const copyFallback = document.querySelector('[data-copy-fallback]');
const copyField = copyFallback.querySelector('textarea');
const citationText = document.querySelector('[data-citation-text]').textContent.trim();
const citationSource = document.querySelector('[data-citation-source]').href;
copyField.value = `${citationText}\n${citationSource}`;

copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  if (copyButton.getAttribute('aria-busy') === 'true') return;
  copyButton.setAttribute('aria-busy', 'true');
  copyStatus.textContent = '';
  try {
    await navigator.clipboard.writeText(copyField.value);
    copyFallback.hidden = true;
    copyStatus.textContent = 'Citation copied.';
  } catch {
    copyStatus.textContent = 'Automatic copying is unavailable.';
    copyFallback.hidden = false;
    copyField.focus();
    copyField.select();
  } finally {
    copyButton.removeAttribute('aria-busy');
  }
});
