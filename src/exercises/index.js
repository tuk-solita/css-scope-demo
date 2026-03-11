import exercise01 from './01-basic-scope.js';
import exercise02 from './02-scope-vs-descendant.js';
import exercise03 from './03-donut-hole.js';
import exercise04 from './04-scope-pseudo.js';
import exercise05 from './05-nested-themes.js';
import exercise06 from './06-component-isolation.js';
import exercise07 from './07-precise-boundaries.js';
import exercise08 from './08-multiple-roots.js';
import exercise09 from './09-inline-scope.js';
import exercise10 from './10-real-world.js';

const exercises = [
  exercise01,
  exercise02,
  exercise03,
  exercise04,
  exercise05,
  exercise06,
  exercise07,
  exercise08,
  exercise09,
  exercise10,
];

export function getAllExercises() {
  return exercises;
}

export function getExercise(id) {
  return exercises.find(ex => ex.id === id);
}

export function getExerciseByIndex(index) {
  return exercises[index];
}
