export default {
  id: 'real-world',
  title: 'Real-World Challenge',
  tier: 3,
  concept: '🏆 Grand Finale',
  revision: 3,
  instructions: `
    Time to put everything together! Below is a dashboard page with a main workspace, a sidebar card, nested themes, and a legacy area that needs careful boundaries.
    <br><br>
    This capstone is about combining <strong>multiple roots</strong>, careful scope boundaries, and <strong>scope proximity</strong> without the exercise spelling out the exact rule shapes for you.
    <br><br>
    Use scoped styles to achieve the following:
    <ul>
      <li>The two outer panels should share the same soft surface treatment: background <code>#f0f4f8</code>, <code>padding: 2rem</code>, and <code>border-radius: 16px</code>.</li>
      <li>The main dashboard heading and the sidebar heading should both use <code>#0369a1</code>. Regular widgets in the modern area should look like white cards with <code>border-radius: 8px</code> and <code>padding: 1rem</code>.</li>
      <li>The legacy section should only receive shell-level styling: its outer box gets a dashed border in <code>#94a3b8</code> with <code>padding: 1rem</code>, but the inner legacy widget should stay untouched by the modern card styling.</li>
      <li>The light and dark theme wrappers should control the color of <code>.title</code> and <code>.value</code> based on the <em>nearest</em> themed ancestor: light theme text should use <code>#0f172a</code>, while the dark theme should use a background of <code>#0f172a</code> with <strong>white text</strong>. The nested light note inside the dark widget should switch back to the light-theme text color.</li>
    </ul>
    Both editors are unlocked! Good luck.
  `,
  html: `<div class="dashboard">
  <h1>Analytics Dashboard</h1>

  <div class="widget theme-light">
    <h3 class="title">Monthly Users</h3>
    <p class="value">1,245</p>
  </div>

  <div class="widget theme-dark">
    <h3 class="title">Conversion Health</h3>
    <p class="value">87%</p>

    <div class="theme-light note">
      <p class="title">Nested note</p>
      <p class="value">Follow-up is trending positive.</p>
    </div>
  </div>

  <div class="legacy-view">
    <h2>Old Reports (Keep the shell, not the inner styles)</h2>
    <div class="widget">
      <h3 class="title">Broken Data</h3>
      <p class="value">N/A</p>
    </div>
  </div>
</div>

<aside class="dashboard-sidebar">
  <h2>Team Notes</h2>
  <p>Ship the scoped refresh today.</p>
</aside>`,
  htmlEditable: true,
  starterCss: `/* Your final test.
   Build the scoped solution from scratch.
   The HTML contains all the selectors you need.
*/
`,
  goalCss: `@scope (.dashboard, .dashboard-sidebar) to (.legacy-view > *) {
  :scope {
    background-color: #f0f4f8;
    padding: 2rem;
    border-radius: 16px;
  }

  :is(h1, h2) {
    color: #0369a1;
  }

  .widget {
    background-color: white;
    border-radius: 8px;
    padding: 1rem;
  }

  .legacy-view {
    border: 2px dashed #94a3b8;
    padding: 1rem;
  }
}

@scope (.theme-light) {
  .title,
  .value {
    color: #0f172a;
  }
}

@scope (.theme-dark) {
  :scope {
    background-color: #0f172a;
  }

  .title,
  .value {
    color: white;
  }

  .note {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 1rem;
  }
}`,
  legacyCss: `.dashboard,
.dashboard-sidebar {
  background-color: #f0f4f8;
  padding: 2rem;
  border-radius: 16px;
}

.dashboard > h1,
.dashboard-sidebar h2 {
  color: #0369a1;
}

.dashboard > .widget {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
}

.dashboard > .legacy-view {
  border: 2px dashed #94a3b8;
  padding: 1rem;
}

.theme-light .title,
.theme-light .value {
  color: #0f172a;
}

.theme-dark .title,
.theme-dark .value {
  color: white;
}

.theme-dark {
  background-color: #0f172a;
}

.theme-dark .note {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
}

.theme-dark .theme-light .title,
.theme-dark .theme-light .value {
  color: #0f172a;
}`,
  checks: [
    { type: 'cssContains', pattern: '@scope\\s*\\(.*\\.dashboard.*,.*\\.dashboard-sidebar.*\\)', message: 'Use a multiple-roots @scope for .dashboard and .dashboard-sidebar' },
    { type: 'cssContains', pattern: 'to\\s*\\(\\s*\\.legacy-view\\s*>\\s*\\*\\s*\\)', message: 'Use `to (.legacy-view > *)` so the shell stays in scope but its children do not' },
    { type: 'cssContains', pattern: '@scope\\s*\\(\\s*\\.theme-light\\s*\\)', message: 'Add a dedicated scope for .theme-light' },
    { type: 'cssContains', pattern: '@scope\\s*\\(\\s*\\.theme-dark\\s*\\)', message: 'Add a dedicated scope for .theme-dark' },
    { type: 'hasComputedStyle', selector: '.dashboard', property: 'backgroundColor', expected: 'rgb(240, 244, 248)', message: 'Dashboard root gets the shared surface background' },
    { type: 'hasComputedStyle', selector: '.dashboard-sidebar', property: 'backgroundColor', expected: 'rgb(240, 244, 248)', message: 'Sidebar root gets the shared surface background too' },
    { type: 'hasComputedStyle', selector: '.dashboard > h1', property: 'color', expected: 'rgb(3, 105, 161)', message: 'Dashboard heading is colored correctly' },
    { type: 'hasComputedStyle', selector: '.dashboard-sidebar h2', property: 'color', expected: 'rgb(3, 105, 161)', message: 'Sidebar heading is colored by the same multi-root scope' },
    { type: 'hasComputedStyle', selector: '.dashboard > .widget.theme-light', property: 'padding', expected: '16px', message: 'In-scope widgets get the white card treatment' },
    { type: 'hasComputedStyle', selector: '.dashboard > .legacy-view', property: 'borderTopColor', expected: 'rgb(148, 163, 184)', message: 'The legacy-view shell stays in scope and gets the dashed border' },
    { type: 'hasNoComputedStyle', selector: '.legacy-view .widget', property: 'padding', notExpected: '16px', message: 'The legacy widget stays out of scope and keeps its default padding' },
    { type: 'hasComputedStyle', selector: '.widget.theme-dark > .value', property: 'color', expected: 'rgb(255, 255, 255)', message: 'Dark-theme widget text becomes white' },
    { type: 'hasComputedStyle', selector: '.widget.theme-dark .theme-light .value', property: 'color', expected: 'rgb(15, 23, 42)', message: 'The nested light note wins back the light-theme text color via scope proximity' },
  ],
  hints: [
    'Two outer containers need the same root-level styling. Look for a way to scope both of them without duplicating the whole rule.',
    'The legacy shell should stay in scope while its children fall out of scope. Think about moving the lower boundary inward instead of stopping at the shell itself.',
    'You will likely end up with one shared outer scope plus separate theme scopes for the light and dark wrappers.',
  ],
};
