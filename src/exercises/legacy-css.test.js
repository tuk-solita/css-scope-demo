import { describe, expect, it } from 'vitest';
import { getAllExercises } from './index.js';

describe('exercise legacyCss metadata', () => {
  it('provides a legacyCss string for every exercise', () => {
    for (const exercise of getAllExercises()) {
      expect(typeof exercise.legacyCss).toBe('string');
      expect(exercise.legacyCss?.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps legacyCss examples free of @scope', () => {
    for (const exercise of getAllExercises()) {
      expect(exercise.legacyCss).not.toMatch(/@scope\b/);
    }
  });
});
