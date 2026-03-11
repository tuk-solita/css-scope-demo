import { createHtmlEditor } from './editor/html-editor.js';
import { createCssEditor } from './editor/css-editor.js';
import { createPreview } from './editor/preview.js';
import { getAllExercises } from './exercises/index.js';
import { runChecks } from './validation/checker.js';
import { createProgress } from './ui/progress.js';
import { createInstructions } from './ui/instructions.js';
import { createGoalPreview } from './ui/goal-preview.js';

const STORAGE_KEY = 'scope-lab-progress';

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function init() {
  const exercises = getAllExercises();
  const state = loadState();
  let currentIndex = state.lastIndex || 0;
  if (!state.completed) state.completed = [];
  if (!state.userCss) state.userCss = {};
  if (!state.userHtml) state.userHtml = {};

  const appHeader = document.getElementById('app-header');
  const instPanelContainer = document.getElementById('instructions-panel');
  const edPanelContainer = document.getElementById('editors-panel');
  const prevPanelContainer = document.getElementById('preview-panel');
  const actPanelContainer = document.getElementById('action-panel');

  // Build structure inside editors/preview panels
  edPanelContainer.innerHTML = `
    <div class="editor-container" id="html-editor-container">
      <div class="editor-header">HTML</div>
      <div class="editor-view" id="html-editor-view"></div>
    </div>
    <div class="editor-container" id="css-editor-container">
      <div class="editor-header">CSS</div>
      <div class="editor-view" id="css-editor-view"></div>
    </div>
  `;

  prevPanelContainer.innerHTML = `
    <div class="preview-container">
      <div class="preview-header">Your Result</div>
      <div class="preview-iframe-wrapper" id="user-preview-view" style="flex:1; display:flex;"></div>
    </div>
    <div class="preview-container">
      <div class="preview-header">🎯 Goal</div>
      <div class="preview-iframe-wrapper" id="goal-preview-view" style="flex:1; display:flex;"></div>
    </div>
  `;

  actPanelContainer.innerHTML = `
    <div class="nav-buttons">
      <button id="btn-prev" class="btn-secondary">⬅ Prev</button>
      <button id="btn-reset" class="btn-secondary">Reset</button>
    </div>
    <div class="validation-area" style="flex:1; margin: 0 1.5rem;">
      <button id="btn-check" class="btn-primary" style="width: 100%">✅ Check Solution</button>
      <div id="validation-checklist" class="validation-checklist" style="display:none;"></div>
    </div>
    <button id="btn-next" class="btn-secondary btn-next">Next ➡</button>
  `;

  const progressUI = createProgress(appHeader, exercises);
  const instructionsUI = createInstructions(instPanelContainer);
  
  progressUI.update(new Set(state.completed));

  progressUI.onNavigate((index) => {
    loadExercise(index);
  });

  const userPreview = createPreview(document.getElementById('user-preview-view'));
  const goalPreview = createGoalPreview(document.getElementById('goal-preview-view'));

  const htmlEditor = createHtmlEditor(document.getElementById('html-editor-view'), {
    onChange: (doc) => {
      const ex = exercises[currentIndex];
      state.userHtml[ex.id] = doc;
      saveState(state);
      if (userPreview) userPreview.update(doc, cssEditor ? cssEditor.getDoc() : '');
    }
  });

  const cssEditor = createCssEditor(document.getElementById('css-editor-view'), {
    onChange: (doc) => {
      const ex = exercises[currentIndex];
      state.userCss[ex.id] = doc;
      saveState(state);
      if (userPreview) userPreview.update(htmlEditor ? htmlEditor.getDoc() : '', doc);
      const checklist = document.getElementById('validation-checklist');
      if (checklist) checklist.style.display = 'none'; // hide checks on edit
    }
  });

  function loadExercise(index) {
    if (index < 0 || index >= exercises.length) return;
    currentIndex = index;
    state.lastIndex = index;
    saveState(state);

    const ex = exercises[currentIndex];
    
    // UI updates
    instructionsUI.update(ex);
    document.getElementById('validation-checklist').style.display = 'none';
    
    // Load content
    const savedHtml = state.userHtml[ex.id];
    const savedCss = state.userCss[ex.id];
    
    htmlEditor.setDoc(savedHtml || ex.html);
    htmlEditor.setReadOnly(!ex.htmlEditable);
    
    cssEditor.setDoc(savedCss || ex.starterCss);

    userPreview.update(htmlEditor.getDoc(), cssEditor.getDoc());
    goalPreview.update(ex.html, ex.goalCss);

    // Nav buttons
    document.getElementById('btn-prev').disabled = currentIndex === 0;
    document.getElementById('btn-next').disabled = currentIndex === exercises.length - 1;
    updateNextButtonState();
  }

  function updateNextButtonState() {
    const ex = exercises[currentIndex];
    const btnNext = document.getElementById('btn-next');
    if (state.completed.includes(ex.id)) {
      btnNext.classList.add('ready');
    } else {
      btnNext.classList.remove('ready');
    }
  }

  // Buttons wiring
  document.getElementById('btn-prev').addEventListener('click', () => loadExercise(currentIndex - 1));
  document.getElementById('btn-next').addEventListener('click', () => loadExercise(currentIndex + 1));
  
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (!confirm('Are you sure you want to reset this exercise to the starting code?')) return;
    const ex = exercises[currentIndex];
    state.userHtml[ex.id] = ex.html;
    state.userCss[ex.id] = ex.starterCss;
    saveState(state);
    loadExercise(currentIndex);
  });

  document.getElementById('btn-check').addEventListener('click', () => {
    const ex = exercises[currentIndex];
    const results = runChecks(ex.checks, cssEditor.getDoc(), userPreview.getDocument());
    
    const checklist = document.getElementById('validation-checklist');
    checklist.style.display = 'flex';
    checklist.innerHTML = results.map(r => `
      <div class="check-item ${r.passed ? 'passed' : 'failed'}">
        <div class="check-icon">${r.passed ? '✅' : '❌'}</div>
        <div>${r.message}</div>
      </div>
    `).join('');

    const allPassed = Object.keys(results).length > 0 && results.every(r => r.passed);
    if (allPassed) {
      if (!state.completed.includes(ex.id)) {
        state.completed.push(ex.id);
        saveState(state);
        progressUI.update(new Set(state.completed));
      }
      updateNextButtonState();
      
      // small animation effect on the concept badge
      const badge = document.getElementById('instruction-concept');
      badge.style.transform = 'scale(1.2)';
      setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      document.getElementById('btn-check').click();
    }
  });

  // Start
  loadExercise(currentIndex);
}

init();
