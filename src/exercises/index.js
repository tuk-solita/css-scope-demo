import exercise01 from './01-basic-scope.js';

const exercises = [
  exercise01,
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
