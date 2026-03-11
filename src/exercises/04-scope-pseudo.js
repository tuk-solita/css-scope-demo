export default {
  id: 'scope-pseudo',
  title: 'Styling the Root with :scope',
  tier: 1,
  concept: '🎯 :scope pseudo-class',
  instructions: `
    What if you want to style the scope root element itself? You can use the <code>:scope</code> pseudo-class!
    <br><br>
    Inside the <code>@scope</code> block, complete the CSS to give the <code>.card</code> element itself 
    a purple border and rounded corners.
  `,
  html: `<div class="card">
  <h2>Card Title</h2>
  <p>Inside the card.</p>
  <button>Click me</button>
</div>`,
  htmlEditable: false,
  starterCss: `@scope (.card) {
  ____ {
    border: 2px solid purple;
    border-radius: 8px;
    padding: 1rem;
  }
  
  h2 {
    color: purple;
  }
}`,
  goalCss: `@scope (.card) {
  :scope {
    border: 2px solid purple;
    border-radius: 8px;
    padding: 1rem;
  }
  
  h2 {
    color: purple;
  }
}`,
  checks: [
    { type: 'cssContains', pattern: ':scope\\s*\\{', message: 'Use the :scope pseudo-class to style the root' },
    { type: 'hasComputedStyle', selector: '.card', property: 'borderColor', expected: 'rgb(128, 0, 128)', message: 'The .card should have a purple border' },
    { type: 'hasComputedStyle', selector: '.card', property: 'borderRadius', expected: '8px', message: 'The .card should have 8px border-radius' },
  ],
  hints: [
    'The pseudo-class for the root element of a scope is appropriately named `:scope`.',
    'Replace the ____ with `:scope`',
  ],
};
