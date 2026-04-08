export default {
  id: 'real-world',
  title: 'Real-World Challenge',
  tier: 3,
  concept: '🏆 Grand Finale',
  instructions: `
    Time to put everything together! Below is a messy HTML structure for a dashboard page.
    <br><br>
    You need to write scoped styles to achieve the following:
    <ul>
      <li>Make the <code>.dashboard</code> background <code>#f0f4f8</code> and pad it with <code>2rem</code> inside a <code>@scope</code> root for <code>.dashboard</code></li>
      <li>Inside the dashboard scope, make all <code>.widget</code> elements have a white background, a <code>border-radius: 8px</code>, and <code>padding: 1rem</code></li>
      <li>However, there is a nested <code>.legacy-view</code> element inside the dashboard! Create a scope limit to <strong>prevent</strong> dashboard styles from bleeding into the legacy view. Ensure the <code>.widget</code> inside the legacy view stays unstyled by the dashboard.</li>
      <li>Give the <code>.dashboard</code> title (the h1) a color of <code>#0369a1</code>, but make sure the <code>h1</code> in the legacy view isn't affected.</li>
    </ul>
    Both editors are unlocked! Good luck.
  `,
  html: `<div class="dashboard">
  <h1>Analytics Dashboard</h1>
  
  <div class="widget">
    <h3>Monthly Users</h3>
    <p>1,245</p>
  </div>
  
  <div class="legacy-view">
    <h1>Old Reports (Do Not Style)</h1>
    <div class="widget">
      <h3>Broken Data</h3>
      <p>N/A</p>
    </div>
  </div>
</div>`,
  htmlEditable: true,
  starterCss: `/* Your final test. Write your @scope rules here. */
`,
  goalCss: `@scope (.dashboard) to (.legacy-view) {
  :scope {
    background-color: #f0f4f8;
    padding: 2rem;
  }
  
  h1 {
    color: #0369a1;
  }
  
  .widget {
    background-color: white;
    border-radius: 8px;
    padding: 1rem;
  }
}`,
  legacyCss: `.dashboard {
  background-color: #f0f4f8;
  padding: 2rem;
}

.dashboard > h1 {
  color: #0369a1;
}

.dashboard > .widget {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
}`,
  checks: [
    { type: 'cssContains', pattern: '@scope.*?to', message: 'A "to" clause is needed to prevent bleed into the legacy view' },
    { type: 'hasComputedStyle', selector: '.dashboard', property: 'backgroundColor', expected: 'rgb(240, 244, 248)', message: 'Dashboard background is #f0f4f8' },
    { type: 'hasComputedStyle', selector: '.dashboard > h1', property: 'color', expected: 'rgb(3, 105, 161)', message: 'Dashboard title is colored correctly' },
    { type: 'hasComputedStyle', selector: '.dashboard > .widget', property: 'padding', expected: '16px', message: 'Dashboard widget has 1rem padding' },
    { type: 'hasNoComputedStyle', selector: '.legacy-view .widget', property: 'padding', notExpected: '16px', message: 'Legacy view widget is NOT padded by dashboard styles' },
    { type: 'hasNoComputedStyle', selector: '.legacy-view h1', property: 'color', notExpected: 'rgb(3, 105, 161)', message: 'Legacy view title is NOT colored' },
  ],
  hints: [
    'You need a donut scope! `@scope (.dashboard) to (.legacy-view)`',
    'Use `:scope { ... }` inside your rule block to hit the dashboard container itself.',
    'Just use `.widget` and `h1` selectors directly inside the block.',
  ],
};
