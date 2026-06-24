import { describe, expect, it } from 'vitest';
import { isHidden, nextVisibilityValue } from './toggle-visibility.value.js';

describe('isHidden', () => {
  it('is true only for "1"', () => {
    expect(isHidden('1')).toBe(true);
    expect(isHidden('0')).toBe(false);
    expect(isHidden('')).toBe(false);
    expect(isHidden(undefined)).toBe(false);
    expect(isHidden(null)).toBe(false);
  });
});

describe('nextVisibilityValue', () => {
  it('flips hidden -> visible and visible -> hidden', () => {
    expect(nextVisibilityValue('1')).toBe('0');
    expect(nextVisibilityValue('0')).toBe('1');
    expect(nextVisibilityValue(undefined)).toBe('1');
    expect(nextVisibilityValue('')).toBe('1');
  });
});
