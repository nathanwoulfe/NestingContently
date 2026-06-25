/**
 * DOM helpers for locating the block entry element a block action belongs to, and the inner
 * element to dim. A block action renders inside `<umb-block-action-list>`'s shadow DOM, which is a
 * sibling of the block content inside the entry host's shadow DOM. `closest()` does not cross
 * shadow boundaries, so we hop from each shadow root to its host and search again.
 */

/** The block entry host elements across the four block editors. */
const BLOCK_ENTRY_SELECTOR =
  'umb-block-list-entry, umb-block-grid-entry, umb-block-rte-entry, umb-block-single-entry';

/** Inner content containers within an entry's shadow root (excludes the action bar). */
const BLOCK_CONTENT_SELECTOR = '.umb-block-list__block, .umb-block-grid__block';

/** Walks up through shadow boundaries to find the block entry host element. */
export function findBlockEntry(start: Element): HTMLElement | null {
  let node: Element | null = start;
  while (node) {
    const found = node.closest?.(BLOCK_ENTRY_SELECTOR) as HTMLElement | null;
    if (found) {
      return found;
    }
    const root = node.getRootNode();
    node = root instanceof ShadowRoot ? (root.host as HTMLElement) : null;
  }
  return null;
}

/**
 * The element to dim for a given entry: the inner block-content container if reachable (so the
 * action bar stays crisp, matching Umbraco's native dimming), otherwise the entry host itself.
 */
export function getDimTarget(entry: HTMLElement): HTMLElement {
  const inner = entry.shadowRoot?.querySelector(BLOCK_CONTENT_SELECTOR) as HTMLElement | null;
  return inner ?? entry;
}
