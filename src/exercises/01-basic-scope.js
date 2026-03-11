export default {
  id: 'basic-scope',
  title: 'Your First Scope',
  tier: 1,
  concept: '🔬 Basic Scope',
  instructions: `
    The page below has two sections: a <code>.card</code> and a <code>.sidebar</code>, both containing paragraphs. 
    Complete the <code>@scope</code> rule so that only paragraphs inside <code>.card</code> turn blue — the sidebar paragraphs should remain unstyled.
  `,
  html: `<div class="card">
  <h2>Card Title</h2>
  <p>This paragraph should be blue.</p>
  <p>This one too!</p>
</div>
<div class="sidebar">
  <h2>Sidebar</h2>
  <p>This paragraph should NOT be blue.</p>
</div>`,
  htmlEditable: false,
  starterCss: `@scope (____) {
  p {
    color: blue;
  }
}`,
  goalCss: `@scope (.card) {
  p {
    color: blue;
  }
}`,
  checks: [
    { type: 'cssContains', pattern: '@scope\\s*\\(\\s*\\.card\\s*\\)', message: 'Use @scope with .card as the scope root' },
    { type: 'hasComputedStyle', selector: '.card p', property: 'color', expected: 'rgb(0, 0, 255)', message: 'Paragraphs inside .card should be blue' },
    { type: 'hasNoComputedStyle', selector: '.sidebar p', property: 'color', notExpected: 'rgb(0, 0, 255)', message: 'Paragraphs inside .sidebar should NOT be blue' },
  ],
  hints: [
    'The @scope rule needs a selector in parentheses to define where styles apply.',
    'What CSS class does the card element have?',
    'Replace ____ with .card',
  ],
};
