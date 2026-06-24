import { findBlockEntry, getDimTarget } from './block-host.js';
import { isHidden, nextVisibilityValue } from './toggle-visibility.value.js';
import { UMB_BLOCK_ENTRY_CONTEXT, UmbBlockActionBase } from '@umbraco-cms/backoffice/block';
import type { MetaBlockActionDefaultKind, UmbBlockActionArgs, UmbBlockDataModel } from '@umbraco-cms/backoffice/block';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

/** The block property toggled to hide/show a block (matches the legacy package). */
export const PROPERTY_ALIAS = 'umbracoNaviHide';

const HIDDEN_ATTR = 'nc-hidden';

function valueEntry(model: UmbBlockDataModel | undefined) {
  return model?.values?.find((x) => x.alias === PROPERTY_ALIAS);
}

/**
 * Block action that toggles the umbracoNaviHide property on a block and dims hidden blocks in the
 * backoffice. Uses the default block-action button kind for native styling; the toggle and dimming
 * are driven from here via the block entry context. Prefers the settings element if it owns the
 * property, otherwise the content element (mirrors the legacy AngularJS behaviour).
 */
export class NestingContentlyToggleAction extends UmbBlockActionBase<MetaBlockActionDefaultKind> {
  #context?: typeof UMB_BLOCK_ENTRY_CONTEXT.TYPE;
  #settingsHidden = false;
  #contentHidden = false;

  constructor(host: UmbControllerHost, args: UmbBlockActionArgs<MetaBlockActionDefaultKind>) {
    super(host, args);

    this.consumeContext(UMB_BLOCK_ENTRY_CONTEXT, async (context) => {
      this.#context = context;
      if (!context) {
        return;
      }

      // Observe the value so we can dim the block on load and whenever it changes.
      if (context.getSettings()) {
        const settings = await context.settingsPropertyValueByAlias<string>(PROPERTY_ALIAS);
        this.observe(settings, (value) => {
          this.#settingsHidden = isHidden(value);
          this.#applyDim();
        }, 'ncSettingsVisibility');
      }

      if (context.getContent()) {
        const content = await context.contentPropertyValueByAlias<string>(PROPERTY_ALIAS);
        this.observe(content, (value) => {
          this.#contentHidden = isHidden(value);
          this.#applyDim();
        }, 'ncContentVisibility');
      }
    });
  }

  override async execute(): Promise<void> {
    const context = this.#context;
    if (!context) {
      return;
    }

    const settings = context.getSettings();
    const content = context.getContent();
    const settingsEntry = valueEntry(settings);
    const contentEntry = valueEntry(content);

    // Toggle wherever the property is defined; prefer settings when present.
    const useSettings = settingsEntry !== undefined || (contentEntry === undefined && settings !== undefined);
    const current = useSettings ? settingsEntry?.value : contentEntry?.value;
    const next = nextVisibilityValue(current);

    if (useSettings) {
      context.setSettingsPropertyValue(PROPERTY_ALIAS, next);
    } else {
      context.setContentPropertyValue(PROPERTY_ALIAS, next);
    }
  }

  #applyDim() {
    const hidden = this.#settingsHidden || this.#contentHidden;
    const entry = findBlockEntry(this.getHostElement());
    if (!entry) {
      return;
    }

    const target = getDimTarget(entry);
    // Clear any prior opacity on both possible targets to avoid a stale dim.
    entry.style.removeProperty('opacity');
    if (target !== entry) {
      target.style.removeProperty('opacity');
    }
    if (hidden) {
      target.style.opacity = '0.6';
    }
    entry.toggleAttribute(HIDDEN_ATTR, hidden);
  }
}

export { NestingContentlyToggleAction as api };
export default NestingContentlyToggleAction;
