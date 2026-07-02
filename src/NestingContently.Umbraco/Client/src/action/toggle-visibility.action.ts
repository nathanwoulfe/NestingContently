import { findBlockEntry, getDimTarget, isHidden, nextVisibilityValue  } from '../util/index.js';
import { UMB_BLOCK_ENTRY_CONTEXT, UMB_BLOCK_MANAGER_CONTEXT, UmbBlockActionBase } from '@umbraco-cms/backoffice/block';
import type { MetaBlockActionDefaultKind, UmbBlockActionArgs, UmbBlockDataModel } from '@umbraco-cms/backoffice/block';
import { firstValueFrom } from '@umbraco-cms/backoffice/external/rxjs';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbVariantId } from '@umbraco-cms/backoffice/variant';

/** The block property toggled to hide/show a block (matches the legacy package). */
const PROPERTY_ALIAS = 'umbracoNaviHide';

/** Default editor for the umbracoNaviHide property (the package requires a true/false property). */
const DEFAULT_EDITOR_ALIAS = 'Umbraco.TrueFalse';

const HIDDEN_ATTR = 'nc-hidden';

interface Target {
  kind: 'content' | 'settings';
  data: UmbBlockDataModel;
  variantId: UmbVariantId;
}

/**
 * Block action that toggles the umbracoNaviHide property on a block and dims hidden blocks. Uses the
 * default block-action button kind for native styling. The property may live on the content or the
 * settings element type; we detect which one declares it (and its variant) via the content-type
 * structures, then rebuild the element's values array and persist it through the block manager.
 */
export class NestingContentlyToggleAction extends UmbBlockActionBase<MetaBlockActionDefaultKind> {
  #entry?: typeof UMB_BLOCK_ENTRY_CONTEXT.TYPE;
  #manager?: typeof UMB_BLOCK_MANAGER_CONTEXT.TYPE;
  #settingsHidden = false;
  #contentHidden = false;

  constructor(host: UmbControllerHost, args: UmbBlockActionArgs<MetaBlockActionDefaultKind>) {
    super(host, args);

    this.consumeContext(UMB_BLOCK_MANAGER_CONTEXT, (manager) => {
      this.#manager = manager;
    });

    this.consumeContext(UMB_BLOCK_ENTRY_CONTEXT, async (entry) => {
      this.#entry = entry;

      // Observe the value so we can dim the block on load and whenever it changes.
      if (entry?.getSettings()) {
        const settings = await entry.settingsPropertyValueByAlias(PROPERTY_ALIAS);
        this.observe(settings, (value) => {
          this.#settingsHidden = isHidden(value);
          this.#applyDim();
        }, 'ncSettingsVisibility');
      }

      if (entry?.getContent()) {
        const content = await entry.contentPropertyValueByAlias(PROPERTY_ALIAS);
        this.observe(content, (value) => {
          this.#contentHidden = isHidden(value);
          this.#applyDim();
        }, 'ncContentVisibility');
      }
    });
  }

  override async execute(): Promise<void> {
    debugger;
    const target = await this.#resolveTarget();
    if (!target) {
      // No umbracoNaviHide property on either element type — nothing to toggle.
      return;
    }

    const existing = target.data.values.find(
      (v) => v.alias === PROPERTY_ALIAS && target.variantId.compare(v),
    );
    const next = nextVisibilityValue(existing?.value);

    const newEntry = {
      editorAlias: existing?.editorAlias ?? DEFAULT_EDITOR_ALIAS,
      culture: target.variantId.culture,
      segment: target.variantId.segment,
      alias: PROPERTY_ALIAS,
      value: next,
    };
    const newValues = [
      ...target.data.values.filter((v) => !(v.alias === PROPERTY_ALIAS && target.variantId.compare(v))),
      newEntry,
    ];
    const newData: UmbBlockDataModel = { ...target.data, values: newValues };

    if (target.kind === 'settings') {
      this.#manager?.setOneSettings(newData);
    } else {
      this.#manager?.setOneContent(newData);
    }
  }

  /** Find which element type (content or settings) declares umbracoNaviHide, with its variant id. */
  async #resolveTarget(): Promise<Target | undefined> {
    const entry = this.#entry;
    const manager = this.#manager;
    if (!entry || !manager) {
      return undefined;
    }

    const settings = entry.getSettings();
    const content = entry.getContent();

    // Prefer settings when it declares the property (mirrors the legacy behaviour).
    const settingsVariantId = await this.#variantIdFor(settings);
    if (settings && settingsVariantId) {
      return { kind: 'settings', data: settings, variantId: settingsVariantId };
    }

    const contentVariantId = await this.#variantIdFor(content);
    if (content && contentVariantId) {
      return { kind: 'content', data: content, variantId: contentVariantId };
    }

    return undefined;
  }

  /** Resolve the variant id for umbracoNaviHide on the given element's structure, or undefined. */
  async #variantIdFor(data: UmbBlockDataModel | undefined): Promise<UmbVariantId | undefined> {
    const entry = this.#entry;
    const manager = this.#manager;
    if (!data || !entry || !manager) {
      return undefined;
    }
    const structure = manager.getStructure(data.contentTypeKey);
    if (!structure) {
      return undefined;
    }
    return firstValueFrom(await entry.propertyVariantId(structure, PROPERTY_ALIAS));
  }

  #applyDim() {
    const hidden = this.#settingsHidden || this.#contentHidden;
    const entry = findBlockEntry(this.getHostElement());
    if (!entry) {
      return;
    }

    const target = getDimTarget(entry);
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
