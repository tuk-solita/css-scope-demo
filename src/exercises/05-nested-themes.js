export default {
  id: 'nested-themes',
  title: 'Nearest Ancestor Problem',
  tier: 2,
  concept: '📏 Scope Proximity',
  revision: 4,
  instructions: `
    Ancestor selectors can limit where a rule applies, but they do <em>not</em> prefer the nearest ancestor.
    In legacy CSS, <code>.light-theme a</code> and <code>.dark-theme a</code> have the same specificity, so source order decides the winner.
    <br><br>
    Write two separate <code>@scope</code> blocks for <code>.light-theme</code> and <code>.dark-theme</code> so link colors follow the nearest themed ancestor instead.
    The outer dark theme link should be <strong>hotpink</strong>, the nested light theme link should turn <strong>rebeccapurple</strong>, and the innermost dark theme link should switch <strong>back to hotpink</strong> thanks to <strong>scope proximity</strong>.
  `,
  html: `<div class="dark-theme">
  <a href="#">This link should be hotpink</a>

  <div class="light-theme">
    <a href="#">This link should be rebeccapurple</a>
  </div>
</div>
<div class="light-theme">
  <a href="#">This link should be rebeccapurple</a>

  <div class="dark-theme">
    <a href="#">This link should be hotpink</a>
  </div>
</div>`,
  htmlEditable: false,
  starterCss: `/* Layout styles are set for you */
.dark-theme { background: #221c2b; color: #f3ecff; padding: 1rem; border-radius: 0.75rem; }
.light-theme { background: #f5efff; color: #2a2135; padding: 1rem; border-radius: 0.75rem; margin-top: 1rem; }
a { font-weight: 600; }

/* Add your @scope rules here:
   - Links inside .dark-theme should be hotpink
   - Links inside .light-theme should be rebeccapurple
   - The innermost dark-theme link should flip back to hotpink automatically
*/

`,
  goalCss: `/* Layout styles are set for you */
.dark-theme { background: #221c2b; color: #f3ecff; padding: 1rem; border-radius: 0.75rem; }
.light-theme { background: #f5efff; color: #2a2135; padding: 1rem; border-radius: 0.75rem; margin-top: 1rem; }
a { font-weight: 600; }

@scope (.dark-theme) {
  a { color: hotpink; }
}

@scope (.light-theme) {
  a { color: rebeccapurple; }
}`,
  legacyCss: `/* Layout styles are set for you */
.dark-theme { background: #221c2b; color: #f3ecff; padding: 1rem; border-radius: 0.75rem; }
.light-theme { background: #f5efff; color: #2a2135; padding: 1rem; border-radius: 0.75rem; margin-top: 1rem; }
a { font-weight: 600; }

/* Legacy CSS needs extra descendant selectors for each nesting pattern */
.light-theme a { color: rebeccapurple; }
.dark-theme a { color: hotpink; }
.dark-theme .light-theme a { color: rebeccapurple; }
.light-theme .dark-theme a { color: hotpink; }`,
  checks: [
    { type: 'cssContains', pattern: '@scope\\s*\\(\\s*\\.dark-theme\\s*\\)', message: 'Define a scope for .dark-theme' },
    { type: 'cssContains', pattern: '@scope\\s*\\(\\s*\\.light-theme\\s*\\)', message: 'Define a scope for .light-theme' },
    { type: 'hasComputedStyle', selector: '.dark-theme > a', property: 'color', expected: 'rgb(255, 105, 180)', message: 'The outer dark theme link should be hotpink' },
    { type: 'hasComputedStyle', selector: '.dark-theme .light-theme > a', property: 'color', expected: 'rgb(102, 51, 153)', message: 'The nested light theme link should turn back to rebeccapurple' },
    { type: 'hasComputedStyle', selector: '.dark-theme .light-theme .dark-theme > a', property: 'color', expected: 'rgb(255, 105, 180)', message: 'The innermost dark theme link should switch back to hotpink' },
  ],
  hints: [
    'You need two separate `@scope` rules.',
    'Both rules should target the nested `a`, not the theme container itself.',
    '`@scope (.dark-theme) { a { color: hotpink; } }`',
    '`@scope (.light-theme) { a { color: rebeccapurple; } }`',
  ],
};
