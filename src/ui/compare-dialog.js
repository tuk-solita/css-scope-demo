import { createCssEditor } from '../editor/css-editor.js';

function getFocusableElements(root) {
  return Array.from(root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
    .filter((element) => !element.hidden && !element.disabled);
}

export function createCompareDialog(container) {
  const overlay = document.createElement('div');
  overlay.className = 'compare-dialog';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="compare-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="compare-dialog-title">
      <div class="compare-dialog-header">
        <div>
          <h2 id="compare-dialog-title" class="compare-dialog-title">Scoped CSS vs. legacy CSS</h2>
          <p class="compare-dialog-subtitle">Compare the canonical pre-@scope approach with your current CSS.</p>
        </div>
        <button type="button" class="compare-dialog-close" aria-label="Close comparison">✕</button>
      </div>
      <div class="compare-dialog-body">
        <section class="compare-pane">
          <div class="compare-pane-label">Before: legacy CSS</div>
          <div class="compare-pane-editor" data-pane="legacy"></div>
        </section>
        <section class="compare-pane">
          <div class="compare-pane-label">Now: your scoped CSS</div>
          <div class="compare-pane-editor" data-pane="current"></div>
        </section>
      </div>
    </div>
  `;

  container.appendChild(overlay);

  const closeButton = overlay.querySelector('.compare-dialog-close');
  const legacyMount = overlay.querySelector('[data-pane="legacy"]');
  const currentMount = overlay.querySelector('[data-pane="current"]');

  if (!closeButton || !legacyMount || !currentMount) {
    throw new Error('Compare dialog markup is missing required elements.');
  }

  legacyMount.classList.add('is-readonly');
  currentMount.classList.add('is-readonly');
  const legacyEditor = createCssEditor(legacyMount, { readOnly: true });
  const currentEditor = createCssEditor(currentMount, { readOnly: true });

  const legacyFocusTarget = legacyEditor.view?.dom;
  const currentFocusTarget = currentEditor.view?.dom;

  if (!legacyFocusTarget || !currentFocusTarget) {
    throw new Error('Compare dialog editors did not expose focusable DOM elements.');
  }

  legacyFocusTarget.tabIndex = 0;
  legacyFocusTarget.setAttribute('aria-label', 'Legacy CSS example');
  currentFocusTarget.tabIndex = 0;
  currentFocusTarget.setAttribute('aria-label', 'Current scoped CSS');

  let currentExercise = null;
  let returnFocusElement = null;
  let isListeningForKeys = false;

  function trapFocus(event) {
    const focusableElements = getFocusableElements(overlay);

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function handleKeydown(event) {
    if (overlay.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === 'Tab') {
      trapFocus(event);
    }
  }

  function open() {
    if (!overlay.hidden || !currentExercise?.legacyCss) {
      return;
    }

    returnFocusElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    overlay.hidden = false;
    document.body.classList.add('compare-dialog-open');
    if (!isListeningForKeys) {
      document.addEventListener('keydown', handleKeydown);
      isListeningForKeys = true;
    }
    closeButton.focus();
  }

  function close({ restoreFocus = true } = {}) {
    if (overlay.hidden) {
      return;
    }

    overlay.hidden = true;
    document.body.classList.remove('compare-dialog-open');
    if (isListeningForKeys) {
      document.removeEventListener('keydown', handleKeydown);
      isListeningForKeys = false;
    }

    if (
      restoreFocus &&
      returnFocusElement &&
      document.contains(returnFocusElement) &&
      typeof returnFocusElement.focus === 'function' &&
      !returnFocusElement.matches(':disabled')
    ) {
      returnFocusElement.focus();
    }
  }

  function handleOverlayClick(event) {
    if (event.target === overlay) {
      close();
    }
  }

  function handleCloseClick() {
    close();
  }

  overlay.addEventListener('click', handleOverlayClick);
  closeButton.addEventListener('click', handleCloseClick);

  return {
    setExercise(exercise) {
      currentExercise = exercise;
      legacyEditor.setDoc(exercise?.legacyCss || '');
    },
    setUserCss(cssText) {
      currentEditor.setDoc(cssText || '');
    },
    open,
    close,
    isOpen() {
      return !overlay.hidden;
    },
    destroy() {
      close({ restoreFocus: false });
      document.removeEventListener('keydown', handleKeydown);
      overlay.removeEventListener('click', handleOverlayClick);
      closeButton.removeEventListener('click', handleCloseClick);
      legacyEditor.view.destroy();
      currentEditor.view.destroy();
      overlay.remove();
    },
  };
}