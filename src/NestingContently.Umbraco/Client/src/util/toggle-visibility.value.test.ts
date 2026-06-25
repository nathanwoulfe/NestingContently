import { describe, expect, it } from 'vitest';
import { isHidden, nextVisibilityValue } from './toggle-visibility.value.js';

describe('isHidden', () => {
  it('treats boolean true and legacy "1"/1 as hidden', () => {
    expect(isHidden(true)).toBe(true);
    expect(isHidden('1')).toBe(true);
    expect(isHidden(1)).toBe(true);
    expect(isHidden('true')).toBe(true);
  });

  it('treats everything else as visible', () => {
    expect(isHidden(false)).toBe(false);
    expect(isHidden('0')).toBe(false);
    expect(isHidden(0)).toBe(false);
    expect(isHidden('')).toBe(false);
    expect(isHidden(undefined)).toBe(false);
    expect(isHidden(null)).toBe(false);
  });
});

describe('nextVisibilityValue', () => {
  it('flips hidden -> visible (false) and visible -> hidden (true)', () => {
    expect(nextVisibilityValue(true)).toBe(false);
    expect(nextVisibilityValue('1')).toBe(false);
    expect(nextVisibilityValue(false)).toBe(true);
    expect(nextVisibilityValue(undefined)).toBe(true);
    expect(nextVisibilityValue('')).toBe(true);
  });
});
