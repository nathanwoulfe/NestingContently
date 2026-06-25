// @vitest-environment happy-dom
import { findBlockEntry, getDimTarget } from './block-host.js';
import { beforeEach, describe, expect, it } from 'vitest';

/**
 * Builds a structure mirroring the real backoffice: a `umb-block-list-entry` host whose shadow DOM
 * contains the block content (`.umb-block-list__block`) and a sibling `umb-block-action-list` whose
 * own shadow DOM contains our toggle element.
 */
function buildBlockEntry(): { entry: HTMLElement; content: HTMLElement; toggle: HTMLElement } {
  const entry = document.createElement('umb-block-list-entry');
  document.body.appendChild(entry);
  const entryShadow = entry.attachShadow({ mode: 'open' });

  const content = document.createElement('div');
  content.className = 'umb-block-list__block';
  entryShadow.appendChild(content);

  const actionList = document.createElement('umb-block-action-list');
  entryShadow.appendChild(actionList);
  const actionShadow = actionList.attachShadow({ mode: 'open' });

  const toggle = document.createElement('nesting-contently-toggle');
  actionShadow.appendChild(toggle);

  return { entry, content, toggle };
}

describe('findBlockEntry', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('finds the entry host by walking up across shadow boundaries from the action element', () => {
    const { entry, toggle } = buildBlockEntry();
    expect(findBlockEntry(toggle)).toBe(entry);
  });

  it('returns null when there is no block entry ancestor', () => {
    const orphan = document.createElement('nesting-contently-toggle');
    document.body.appendChild(orphan);
    expect(findBlockEntry(orphan)).toBeNull();
  });
});

describe('getDimTarget', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns the inner block content container so the action bar stays crisp', () => {
    const { entry, content } = buildBlockEntry();
    expect(getDimTarget(entry)).toBe(content);
  });

  it('falls back to the entry host when no inner content container exists', () => {
    const entry = document.createElement('umb-block-grid-entry');
    entry.attachShadow({ mode: 'open' });
    document.body.appendChild(entry);
    expect(getDimTarget(entry)).toBe(entry);
  });
});
