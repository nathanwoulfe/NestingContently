import { naviHideVariantId } from '../util/index.js';
import { UMB_BLOCK_ENTRY_CONTEXT, UMB_BLOCK_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/block';
import type { UmbBlockDataModel } from '@umbraco-cms/backoffice/block';
import { UmbConditionBase } from '@umbraco-cms/backoffice/extension-registry';
import type {
  UmbConditionConfigBase,
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from '@umbraco-cms/backoffice/extension-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

type ElementKind = 'settings' | 'content';

/**
 * Permitted only when the block being edited declares an `umbracoNaviHide` property on its settings
 * or content element type. Used to gate the toggle-visibility block action so its power icon only
 * appears on blocks that can actually be hidden — the action is registered for every block-list and
 * block-grid block, but is a no-op on blocks without the property.
 *
 * Detection mirrors the action's own target resolution, but reactively: `propertyVariantId` is
 * observable-backed and emits `undefined` until the element type finishes loading, so we `observe()`
 * it rather than sampling the first value (which would risk hiding the button on a supported block
 * before its content type had loaded).
 */
export class NestingContentlyToggleVisibilityCondition
  extends UmbConditionBase<UmbConditionConfigBase>
  implements UmbExtensionCondition
{
  #entry?: typeof UMB_BLOCK_ENTRY_CONTEXT.TYPE;
  #manager?: typeof UMB_BLOCK_MANAGER_CONTEXT.TYPE;
  #declares: Record<ElementKind, boolean> = { settings: false, content: false };

  constructor(host: UmbControllerHost, args: UmbConditionControllerArguments<UmbConditionConfigBase>) {
    super(host, args);

    this.consumeContext(UMB_BLOCK_MANAGER_CONTEXT, (manager) => {
      this.#manager = manager;
      this.#update();
    });

    this.consumeContext(UMB_BLOCK_ENTRY_CONTEXT, (entry) => {
      this.#entry = entry;
      this.#update();
    });
  }

  #update(): void {
    if (!this.#entry || !this.#manager) {
      return;
    }

    void this.#observeElement('settings', this.#entry.getSettings());
    void this.#observeElement('content', this.#entry.getContent());
  }

  async #observeElement(kind: ElementKind, data: UmbBlockDataModel | undefined): Promise<void> {
    const entry = this.#entry;
    const manager = this.#manager;
    if (!entry || !manager) {
      return;
    }

    const variantId$ = await naviHideVariantId(entry, manager, data);
    if (!variantId$) {
      this.#setDeclares(kind, false);
      return;
    }

    this.observe(
      variantId$,
      (variantId) => this.#setDeclares(kind, variantId !== undefined),
      `ncNaviHide_${kind}`,
    );
  }

  #setDeclares(kind: ElementKind, value: boolean): void {
    this.#declares[kind] = value;
    // UmbConditionBase's `permitted` setter notifies the registry only when the value changes.
    this.permitted = this.#declares.settings || this.#declares.content;
  }
}
