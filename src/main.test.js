import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const STORAGE_KEY = 'scope-lab-progress';
let mockExercises = [];
const editorState = {
  html: null,
  css: null,
};
let storage = {};

vi.mock('./exercises/index.js', () => ({
  getAllExercises: () => mockExercises,
}));

vi.mock('./editor/html-editor.js', () => ({
  createHtmlEditor: (_container, { onChange } = {}) => {
    let doc = '';
    const api = {
      getDoc: () => doc,
      setDoc: (value) => {
        doc = value;
      },
      setReadOnly: vi.fn(),
      _onChange: onChange,
    };

    editorState.html = api;
    return api;
  },
}));

vi.mock('./editor/css-editor.js', () => ({
  createCssEditor: (_container, { onChange } = {}) => {
    let doc = '';
    const api = {
      getDoc: () => doc,
      setDoc: (value) => {
        doc = value;
      },
      setReadOnly: vi.fn(),
      _onChange: onChange,
    };

    editorState.css = api;
    return api;
  },
}));

vi.mock('./editor/preview.js', () => ({
  createPreview: () => ({
    update: vi.fn(),
    getDocument: () => document,
  }),
}));

vi.mock('./ui/goal-preview.js', () => ({
  createGoalPreview: () => ({
    update: vi.fn(),
  }),
}));

vi.mock('./ui/progress.js', () => ({
  createProgress: () => ({
    update: vi.fn(),
    onNavigate: vi.fn(),
  }),
}));

vi.mock('./ui/instructions.js', () => ({
  createInstructions: () => ({
    update: vi.fn(),
  }),
}));

vi.mock('./ui/compare-dialog.js', () => ({
  createCompareDialog: () => ({
    close: vi.fn(),
    open: vi.fn(),
    setExercise: vi.fn(),
    setUserCss: vi.fn(),
  }),
}));

vi.mock('./validation/checker.js', () => ({
  runChecks: vi.fn(() => []),
}));

function createExercise(overrides = {}) {
  return {
    id: 'real-world',
    title: 'Real-World Challenge',
    tier: 3,
    concept: '🏆 Grand Finale',
    instructions: 'Final exercise',
    html: '<div class="dashboard"><aside class="dashboard-sidebar"></aside></div>',
    htmlEditable: true,
    starterCss: '@scope (.dashboard, .dashboard-sidebar) {}',
    goalCss: '@scope (.dashboard, .dashboard-sidebar) {}',
    legacyCss: '.dashboard {}',
    checks: [],
    hints: [],
    revision: 2,
    ...overrides,
  };
}

function renderAppShell() {
  document.body.innerHTML = `
    <div id="app-header"></div>
    <div id="instructions-panel"></div>
    <div id="editors-panel"></div>
    <div id="preview-panel"></div>
    <div id="action-panel"></div>
  `;
}

function installLocalStorageMock() {
  storage = {};

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
      },
      setItem(key, value) {
        storage[key] = String(value);
      },
      removeItem(key) {
        delete storage[key];
      },
      clear() {
        storage = {};
      },
    },
  });
}

beforeEach(() => {
  vi.resetModules();
  installLocalStorageMock();
  localStorage.clear();
  renderAppShell();
  mockExercises = [];
  editorState.html = null;
  editorState.css = null;
});

afterEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
});

describe('main app exercise draft loading', () => {
  it('replaces stale saved drafts when an exercise revision changes', async () => {
    const exercise = createExercise();
    mockExercises = [exercise];

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      lastIndex: 0,
      completed: [],
      userHtml: {
        'real-world': '<div class="dashboard"><div class="widget">old markup</div></div>',
      },
      userCss: {
        'real-world': '@scope (.dashboard) { .widget { padding: 1rem; } }',
      },
      exerciseRevisions: {
        'real-world': 1,
      },
    }));

    await import('./main.js');

    expect(editorState.html?.getDoc()).toBe(exercise.html);
    expect(editorState.css?.getDoc()).toBe(exercise.starterCss);

    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(savedState.userHtml['real-world']).toBe(exercise.html);
    expect(savedState.userCss['real-world']).toBe(exercise.starterCss);
    expect(savedState.exerciseRevisions['real-world']).toBe(2);
  });
});
