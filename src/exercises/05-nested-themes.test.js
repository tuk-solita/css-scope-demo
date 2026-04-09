import { describe, expect, it } from 'vitest';
import exercise from './05-nested-themes.js';

describe('scope proximity exercise', () => {
  it('teaches the nearest-ancestor theme problem with scoped link colors', () => {
    expect(exercise.title).toBe('Nearest Ancestor Problem');
    expect(exercise.concept).toBe('📏 Scope Proximity');
    expect(exercise.revision).toBe(4);

    expect(exercise.html).toContain('class="dark-theme"');
    expect(exercise.html).toContain('class="light-theme"');
    expect(exercise.html).toMatch(/class="light-theme"[\s\S]*class="dark-theme"/);
    expect(exercise.html).toContain('<a href="#">');
    expect(exercise.html).toContain('This link should be hotpink');
    expect(exercise.html).toContain('This link should be rebeccapurple');

    expect(exercise.instructions).toMatch(/source order/i);
    expect(exercise.instructions).toMatch(/nearest ancestor/i);
    expect(exercise.instructions).toMatch(/scope proximity/i);
    expect(exercise.instructions).toMatch(/hotpink/i);
    expect(exercise.instructions).toMatch(/rebeccapurple/i);
    expect(exercise.instructions).toMatch(/innermost dark theme link/i);

    expect(exercise.goalCss).toContain('@scope (.light-theme)');
    expect(exercise.goalCss).toContain('@scope (.dark-theme)');
    expect(exercise.goalCss).toContain('a { color: rebeccapurple; }');
    expect(exercise.goalCss).toContain('a { color: hotpink; }');

    expect(exercise.legacyCss).toContain('.light-theme a');
    expect(exercise.legacyCss).toContain('.dark-theme a');
    expect(exercise.legacyCss).toContain('.dark-theme .light-theme a');
    expect(exercise.legacyCss).toContain('.light-theme .dark-theme a');
  });
});
