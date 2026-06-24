import { nextVisibilityValue } from './toggle-visibility.value.js';
import { UMB_BLOCK_ENTRY_CONTEXT, UmbBlockActionBase } from '@umbraco-cms/backoffice/block';
import type { MetaBlockActionDefaultKind, UmbBlockActionArgs, UmbBlockDataModel } from '@umbraco-cms/backoffice/block';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

/** The block property toggled to hide/show a block (matches the legacy package). */
export const PROPERTY_ALIAS = 'umbracoNaviHide';

/** Reads the umbracoNaviHide value from a block data model, noting whether it is present. */
export function readVisibility(model: UmbBlockDataModel | undefined): { found: boolean; value: unknown } {
  const entry = model?.values?.find((x) => x.alias === PROPERTY_ALIAS);
  return { found: entry !== undefined, value: entry?.value };
}

/**
 * Block action that toggles the umbracoNaviHide property on a block. Prefers the settings
 * element if it owns the property; otherwise falls back to the content element. This mirrors
 * the legacy AngularJS behaviour (settings first, then content).
 */
export class NestingContentlyToggleAction extends UmbBlockActionBase<MetaBlockActionDefaultKind> {
  #context?: typeof UMB_BLOCK_ENTRY_CONTEXT.TYPE;

  constructor(host: UmbControllerHost, args: UmbBlockActionArgs<MetaBlockActionDefaultKind>) {
    super(host, args);
    this.consumeContext(UMB_BLOCK_ENTRY_CONTEXT, (context) => {
      this.#context = context;
    });
  }

  override async execute(): Promise<void> {
    const context = this.#context;
    if (!context) {
      return;
    }

    const settings = context.getSettings();
    const content = context.getContent();
    const inSettings = readVisibility(settings);
    const inContent = readVisibility(content);

    // Use settings when the property lives there, or when a settings element exists and content
    // does not declare the property; otherwise toggle on the content element.
    const useSettings = inSettings.found || (settings !== undefined && !inContent.found);
    const current = useSettings ? inSettings.value : inContent.value;
    const next = nextVisibilityValue(current);

    if (useSettings) {
      context.setSettingsPropertyValue(PROPERTY_ALIAS, next);
    } else {
      context.setContentPropertyValue(PROPERTY_ALIAS, next);
    }
  }
}

export default NestingContentlyToggleAction;
