export default {
  id: 'nested-themes',
  title: 'Nested Themes',
  tier: 2,
  concept: '📏 Scope Proximity',
  instructions: `
    When two scopes conflict, <code>@scope</code> introduces a new criterion: <strong>Scoping Proximity</strong>.
    The rule that is physically closer in the DOM tree wins, regardless of source order!
    <br><br>
    The editor has nested light and dark theme components. Write two separate <code>@scope</code> blocks 
    for <code>.light-theme</code> and <code>.dark-theme</code>. Give each one a white or black text color for 
    the <code>p</code> element. Watch how proximity correctly colors the innermost component!
  `,
  html: `<div class="light-theme">
  <p>Light theme text (should be black)</p>
  
  <div class="dark-theme">
    <p>Dark theme text (should be white)</p>
    
    <div class="light-theme">
      <p>Light theme text (should be black)</p>
    </div>
  </div>
</div>`,
  htmlEditable: false,
  starterCss: `/* The background colors are set for you */
.light-theme { background: #cccccc; padding: 1rem; border: 1px solid #999; }
.dark-theme { background: #333333; padding: 1rem; border: 1px solid #111; }

/* Add your @scope rules here:
   - For .light-theme, p should be colored black
   - For .dark-theme, p should be colored white 
*/

`,
  goalCss: `/* The background colors are set for you */
.light-theme { background: #cccccc; padding: 1rem; border: 1px solid #999; }
.dark-theme { background: #333333; padding: 1rem; border: 1px solid #111; }

@scope (.light-theme) {
  p { color: black; }
}

@scope (.dark-theme) {
  p { color: white; }
}`,
  checks: [
    { type: 'cssContains', pattern: '@scope\\s*\\(\\s*\\.light-theme\\s*\\)', message: 'Define a scope for .light-theme' },
    { type: 'cssContains', pattern: '@scope\\s*\\(\\s*\\.dark-theme\\s*\\)', message: 'Define a scope for .dark-theme' },
    { type: 'hasComputedStyle', selector: '.light-theme > p', property: 'color', expected: 'rgb(0, 0, 0)', message: 'Top-level light theme paragraph should be black' },
    { type: 'hasComputedStyle', selector: '.dark-theme > p', property: 'color', expected: 'rgb(255, 255, 255)', message: 'Nested dark theme paragraph should be white' },
    { type: 'hasComputedStyle', selector: '.dark-theme .light-theme > p', property: 'color', expected: 'rgb(0, 0, 0)', message: 'Innermost light theme paragraph should be black' },
  ],
  hints: [
    'You need two separate `@scope` rules.',
    '`@scope (.light-theme) { p { color: black; } }`',
    '`@scope (.dark-theme) { p { color: white; } }`',
  ],
};
