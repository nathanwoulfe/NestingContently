import { findBlockEntry, getDimTarget } from './block-host.js';
import { PROPERTY_ALIAS } from './toggle-visibility.action.js';
import { isHidden } from './toggle-visibility.value.js';
import { UMB_BLOCK_ENTRY_CONTEXT } from '@umbraco-cms/backoffice/block';
import type { UmbBlockAction } from '@umbraco-cms/backoffice/block';
import { css, customElement, html, nothing, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

/**
 * Custom block action element. Renders a power toggle whose state reflects umbracoNaviHide, and
 * dims the containing block (mirroring Umbraco's native dimming of unexposed blocks) by setting
 * inline opacity on the block content — opacity applies through shadow boundaries, unlike global CSS.
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
  #entry: HTMLElement | null = null;

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
    this.#entry = findBlockEntry(this);
    this.#applyDim();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Leave no inline style behind if the action is removed.
    if (this.#entry) {
      this.#entry.style.removeProperty('opacity');
      getDimTarget(this.#entry).style.removeProperty('opacity');
      this.#entry.removeAttribute('nc-hidden');
    }
  }

  #recompute() {
    this._hidden = this.#settingsHidden || this.#contentHidden;
    this.#applyDim();
  }

  #applyDim() {
    // The entry may not have been resolvable at connectedCallback time; resolve lazily.
    this.#entry ??= findBlockEntry(this);
    const entry = this.#entry;
    if (!entry) {
      return;
    }

    const target = getDimTarget(entry);
    // Clear any prior opacity on both possible targets to avoid a stale dim.
    entry.style.removeProperty('opacity');
    if (target !== entry) {
      target.style.removeProperty('opacity');
    }
    if (this._hidden) {
      target.style.opacity = '0.6';
    }
    entry.toggleAttribute('nc-hidden', this._hidden);
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
