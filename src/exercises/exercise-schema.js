/**
 * @typedef {Object} Check
 * @property {'hasComputedStyle' | 'hasNoComputedStyle' | 'cssContains' | 'cssNotContains'} type
 * @property {string} message
 * @property {string} [pattern]
 * @property {string} [selector]
 * @property {string} [property]
 * @property {string} [expected]
 * @property {string} [notExpected]
 */

/**
 * @typedef {Object} Exercise
 * @property {string} id
 * @property {string} title
 * @property {1|2|3} tier
 * @property {string} concept
 * @property {string} instructions
 * @property {string} html
 * @property {boolean} [htmlEditable=false]
 * @property {string} [goalHtml] - solved HTML for the goal preview (when HTML is editable)
 * @property {string} starterCss
 * @property {string} goalCss
 * @property {Check[]} checks
 * @property {string[]} hints
 */
