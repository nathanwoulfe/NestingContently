import { PROPERTY_ALIAS } from './toggle-visibility.action.js';
import { isHidden } from './toggle-visibility.value.js';
import { UMB_BLOCK_ENTRY_CONTEXT } from '@umbraco-cms/backoffice/block';
import type { UmbBlockAction } from '@umbraco-cms/backoffice/block';
import { css, customElement, html, nothing, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

/** Selector for the block entry host element we dim when a block is hidden. */
const BLOCK_HOST_SELECTOR =
  'umb-block-grid-block, umb-block-list-block, umb-ref-grid-block, umb-ref-list-block, [data-umb-block-entry]';

/**
 * Walks up through shadow boundaries to find the block entry host element. `closest()` does not
 * cross shadow roots, so we hop from each shadow root to its host and search again.
 */
function findBlockHost(start: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = start;
  while (el) {
    const found = el.closest?.(BLOCK_HOST_SELECTOR) as HTMLElement | null;
    if (found) {
      return found;
    }
    const root = el.getRootNode();
    el = root instanceof ShadowRoot ? (root.host as HTMLElement) : null;
  }
  return null;
}

/**
 * Custom block action element. Renders a power toggle whose state reflects umbracoNaviHide, and
 * dims the containing block (mirroring Umbraco's native dimming of unexposed blocks) by setting
 * inline opacity on the block host — opacity applies through shadow boundaries, unlike global CSS.
 */
@customElement('nesting-contently-toggle')
export class NestingContentlyToggleElement extends UmbLitElement {
  @property({ attribute: false })
  manifest?: unknown;

  @property({ attribute: false })
  api?: UmbBlockAction<unknown>;

  @state()
  private _hidden = false;

  #settingsHidden = false;
  #contentHidden = false;
  #blockHost: HTMLElement | null = null;

  constructor() {
    super();
    this.consumeContext(UMB_BLOCK_ENTRY_CONTEXT, async (context) => {
      if (!context) {
        return;
      }

      if (context.getSettings()) {
        const settings = await context.settingsPropertyValueByAlias(PROPERTY_ALIAS);
        this.observe(settings, (value) => {
          this.#settingsHidden = isHidden(value);
          this.#recompute();
        }, 'ncSettingsVisibility');
      }

      if (context.getContent()) {
        const content = await context.contentPropertyValueByAlias(PROPERTY_ALIAS);
        this.observe(content, (value) => {
          this.#contentHidden = isHidden(value);
          this.#recompute();
        }, 'ncContentVisibility');
      }
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#blockHost = findBlockHost(this);
    this.#applyDim();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Leave no inline style behind if the action is removed.
    if (this.#blockHost) {
      this.#blockHost.style.removeProperty('opacity');
    }
  }

  #recompute() {
    this._hidden = this.#settingsHidden || this.#contentHidden;
    this.#applyDim();
  }

  #applyDim() {
    if (!this.#blockHost) {
      return;
    }
    this.#blockHost.toggleAttribute('nc-hidden', this._hidden);
    this.#blockHost.style.opacity = this._hidden ? '0.6' : '';
  }

  async #onClick(event: Event) {
    event.stopPropagation();
    await this.api?.execute();
  }

  override render() {
    if (!this.api) {
      return nothing;
    }
    const label = this._hidden ? this.localize.term('actions_enable') : this.localize.term('actions_disable');
    return html`
      <uui-button look="secondary" label=${label} title=${label} @click=${this.#onClick}>
        <uui-icon name="icon-power"></uui-icon>
      </uui-button>
    `;
  }

  static override styles = css`
    :host {
      display: inline-flex;
    }
  `;
}

export default NestingContentlyToggleElement;

declare global {
  interface HTMLElementTagNameMap {
    'nesting-contently-toggle': NestingContentlyToggleElement;
  }
}
