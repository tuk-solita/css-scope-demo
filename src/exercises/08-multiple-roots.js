export default {
  id: 'multiple-roots',
  title: 'Multiple Scope Roots',
  tier: 2,
  concept: '🌳 Multiple Roots',
  instructions: `
    You can specify multiple selector lists for both the scope root and the limit, creating multiple scope definitions at once!
    <br><br>
    Write a <strong>single</strong> <code>@scope</code> block that applies to both <code>.hero</code> 
    and <code>.footer</code> sections.
    <br><br>
    Inside it, target the <code>h2</code> elements and give them <code>letter-spacing: 2px</code> 
    and a <code>color: cadetblue</code>.
  `,
  html: `<div class="hero">
  <h2>Hero Heading</h2>
</div>

<div class="content">
  <h2>Content Heading (do not style)</h2>
</div>

<div class="footer">
  <h2>Footer Heading</h2>
</div>`,
  htmlEditable: false,
  starterCss: `/* Write your @scope rule below: */
`,
  goalCss: `@scope (.hero, .footer) {
  h2 {
    letter-spacing: 2px;
    color: cadetblue;
  }
}`,
  checks: [
    { type: 'cssContains', pattern: '@scope\\s*\\(.*\\.hero.*,.*\\.footer.*\\)', message: 'Use a comma-separated selector list for the scope root' },
    { type: 'hasComputedStyle', selector: '.hero h2', property: 'color', expected: 'rgb(95, 158, 160)', message: 'Hero h2 should be cadetblue' },
    { type: 'hasComputedStyle', selector: '.footer h2', property: 'color', expected: 'rgb(95, 158, 160)', message: 'Footer h2 should be cadetblue' },
    { type: 'hasNoComputedStyle', selector: '.content h2', property: 'color', notExpected: 'rgb(95, 158, 160)', message: 'Content h2 should NOT be styled' },
  ],
  hints: [
    'Just like normal CSS rules, you can separate scope root selectors with a comma.',
    'The syntax is `@scope (.hero, .footer) { ... }`',
  ],
};
