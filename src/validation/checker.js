import {
  checkCssContains,
  checkCssNotContains,
  checkComputedStyle,
  checkNoComputedStyle
} from './rules.js';

/**
 * Runs all validation checks for an exercise.
 * @param {Array} checks - The array of check objects from the exercise definition
 * @param {string} cssText - The raw CSS text from the user's editor
 * @param {Document} iframeDoc - The document object from the running preview iframe
 * @returns {Array<{passed: boolean, message: string}>}
 */
export function runChecks(checks, cssText, iframeDoc) {
  return checks.map(check => {
    switch (check.type) {
      case 'cssContains':
        return checkCssContains(cssText, check.pattern, check.message);
      case 'cssNotContains':
        return checkCssNotContains(cssText, check.pattern, check.message);
      case 'hasComputedStyle':
        return checkComputedStyle(iframeDoc, check.selector, check.property, check.expected, check.message);
      case 'hasNoComputedStyle':
        return checkNoComputedStyle(iframeDoc, check.selector, check.property, check.notExpected, check.message);
      default:
        return { passed: false, message: `Unknown check type: ${check.type}` };
    }
  });
}
