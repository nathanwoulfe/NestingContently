/**
 * Helpers for interpreting and flipping the umbracoNaviHide value. The value is a true/false
 * property, so the canonical hidden value is the boolean `true`. We also treat the legacy string
 * "1"/number 1 as hidden so content created by older versions keeps working.
 */

/** A block is hidden when umbracoNaviHide is truthy in any of its accepted forms. */
export function isHidden(value: unknown): boolean {
  return value === true || value === '1' || value === 1 || value === 'true';
}

/** The value to write when toggling: the opposite of the current hidden state (boolean). */
export function nextVisibilityValue(value: unknown): boolean {
  return !isHidden(value);
}
