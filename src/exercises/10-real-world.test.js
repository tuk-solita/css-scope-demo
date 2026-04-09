import { describe, expect, it } from 'vitest';
import exercise from './10-real-world.js';

describe('real-world exercise capstone coverage', () => {
  it('combines multiple advanced @scope tactics in the canonical solution', () => {
    expect(exercise.goalCss).toContain('@scope (.dashboard, .dashboard-sidebar)');
    expect(exercise.goalCss).toContain('to (.legacy-view > *)');
    expect(exercise.goalCss).toContain('@scope (.theme-light)');
    expect(exercise.goalCss).toContain('@scope (.theme-dark)');
  });

  it('includes markup and guidance for the expanded capstone scenarios', () => {
    expect(exercise.html).toContain('dashboard-sidebar');
    expect(exercise.html).toContain('theme-dark');
    expect(exercise.html).toContain('theme-light');
    expect(exercise.instructions).toContain('multiple roots');
    expect(exercise.instructions).toContain('scope proximity');
    expect(exercise.instructions).toMatch(/dark theme[\s\S]*white text/i);
    expect(exercise.instructions).toMatch(/dark theme[\s\S]*background[\s\S]*#0f172a/i);
    expect(exercise.instructions).toMatch(/legacy[\s\S]*dashed border[\s\S]*#94a3b8/i);
    expect(exercise.instructions).toMatch(/legacy[\s\S]*padding[\s\S]*1rem/i);
  });

  it('does not reveal the exact solution shape in the default instructions or starter CSS', () => {
    expect(exercise.instructions).not.toContain('@scope (.theme-light)');
    expect(exercise.instructions).not.toContain('@scope (.theme-dark)');
    expect(exercise.instructions).not.toContain(':scope');

    expect(exercise.starterCss).not.toContain('.dashboard-sidebar');
    expect(exercise.starterCss).not.toContain('.legacy-view');
    expect(exercise.starterCss).not.toContain('.theme-light');
    expect(exercise.starterCss).not.toContain('.theme-dark');
    expect(exercise.starterCss).not.toContain('____');
  });

  it('keeps the canonical goal theme content readable', () => {
    expect(exercise.goalCss).toMatch(/@scope\s*\(\s*\.theme-dark\s*\)[\s\S]*background-color\s*:/);
    expect(exercise.goalCss).toMatch(/@scope\s*\(\s*\.theme-dark\s*\)[\s\S]*\.note[\s\S]*background-color\s*:/);
  });
});
