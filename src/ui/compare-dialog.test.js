import { afterEach, describe, expect, it, vi } from 'vitest';

const editorInstances = [];

vi.mock('../editor/css-editor.js', () => ({
  createCssEditor(container, { initialDoc = '', readOnly = false } = {}) {
    let doc = initialDoc;
    const element = document.createElement('pre');
    element.className = 'mock-css-editor';
    element.dataset.readOnly = String(readOnly);
    element.tabIndex = 0;
    element.textContent = doc;
    container.appendChild(element);

    const api = {
      view: {
        dom: element,
        destroy: vi.fn(),
      },
      getDoc: () => doc,
      setDoc: (value) => {
        doc = value;
        element.textContent = value;
      },
      setReadOnly: vi.fn(),
    };

    editorInstances.push({ api, element, readOnly });
    return api;
  },
}));

const { createCompareDialog } = await import('./compare-dialog.js').catch(() => ({}));

function createExercise(overrides = {}) {
  return {
    id: 'basic-scope',
    title: 'Your First Scope',
    legacyCss: '.card p { color: blue; }',
    ...overrides,
  };
}

afterEach(() => {
  document.body.innerHTML = '';
  editorInstances.length = 0;
});

describe('compare dialog module', () => {
  it('exports a dialog factory', () => {
    expect(createCompareDialog).toBeTypeOf('function');
  });
});

describe.runIf(typeof createCompareDialog === 'function')('compare dialog behavior', () => {
  it('opens with read-only legacy and current CSS panes', () => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    document.body.appendChild(trigger);
    trigger.focus();

    const dialog = createCompareDialog(document.body);
    dialog.setExercise(createExercise());
    dialog.setUserCss('@scope (.card) {\n  p { color: blue; }\n}');
    dialog.open();

    const overlay = document.querySelector('.compare-dialog');
    const closeButton = document.querySelector('.compare-dialog-close');

    expect(overlay).not.toBeNull();
    expect(overlay.hidden).toBe(false);
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(document.body.textContent).toContain('Scoped CSS vs. legacy CSS');
    expect(document.body.textContent).toContain('Before: legacy CSS');
    expect(document.body.textContent).toContain('Now: your scoped CSS');
    expect(editorInstances).toHaveLength(2);
    expect(editorInstances.map((instance) => instance.readOnly)).toEqual([true, true]);
    expect(editorInstances[0].element.textContent).toContain('.card p');
    expect(editorInstances[1].element.textContent).toContain('@scope (.card)');
    expect(document.activeElement).toBe(closeButton);
  });

  it('closes from the close button and restores focus to the trigger', () => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    document.body.appendChild(trigger);

    const dialog = createCompareDialog(document.body);
    dialog.setExercise(createExercise());
    dialog.setUserCss('body { color: red; }');

    trigger.focus();
    dialog.open();
    document.querySelector('.compare-dialog-close').click();

    expect(document.querySelector('.compare-dialog').hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on Escape and backdrop click', () => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    document.body.appendChild(trigger);

    const dialog = createCompareDialog(document.body);
    dialog.setExercise(createExercise());
    dialog.setUserCss('body { color: red; }');

    trigger.focus();
    dialog.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('.compare-dialog').hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);

    trigger.focus();
    dialog.open();
    document.querySelector('.compare-dialog').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.querySelector('.compare-dialog').hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('traps focus between the close button and code panes', () => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    document.body.appendChild(trigger);

    const dialog = createCompareDialog(document.body);
    dialog.setExercise(createExercise());
    dialog.setUserCss('body { color: red; }');

    trigger.focus();
    dialog.open();

    const closeButton = document.querySelector('.compare-dialog-close');
    const lastFocusableElement = editorInstances[1].element;

    closeButton.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
    expect(document.activeElement).toBe(lastFocusableElement);

    lastFocusableElement.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(closeButton);
  });

  it('does not open when the exercise has no legacyCss', () => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    document.body.appendChild(trigger);

    const dialog = createCompareDialog(document.body);
    dialog.setExercise(createExercise({ legacyCss: '' }));
    dialog.setUserCss('body { color: red; }');

    trigger.focus();
    dialog.open();

    expect(document.querySelector('.compare-dialog').hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('updates the current CSS pane after the dialog has rendered', () => {
    const dialog = createCompareDialog(document.body);
    dialog.setExercise(createExercise());
    dialog.setUserCss('body { color: red; }');
    dialog.open();

    dialog.setUserCss('@scope (.card) { p { color: blue; } }');

    expect(editorInstances[1].element.textContent).toContain('@scope (.card)');
  });

  it('destroys editor instances and removes the dialog from the DOM', () => {
    const dialog = createCompareDialog(document.body);
    dialog.setExercise(createExercise());
    dialog.setUserCss('body { color: red; }');
    dialog.open();

    dialog.destroy();

    expect(editorInstances[0].api.view.destroy).toHaveBeenCalledTimes(1);
    expect(editorInstances[1].api.view.destroy).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.compare-dialog')).toBeNull();
  });
});
