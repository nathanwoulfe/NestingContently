/** The stored value used to mark a block as hidden (umbracoNaviHide). */
export const HIDDEN_VALUE = '1';
export const VISIBLE_VALUE = '0';

/** A block is hidden only when its umbracoNaviHide value is exactly "1". */
export function isHidden(value: unknown): boolean {
  return value === HIDDEN_VALUE;
}

/** The value to write when toggling: visible if currently hidden, else hidden. */
export function nextVisibilityValue(value: unknown): '0' | '1' {
  return isHidden(value) ? VISIBLE_VALUE : HIDDEN_VALUE;
}
