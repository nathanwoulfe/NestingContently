import { UMB_BLOCK_ENTRY_CONTEXT, UMB_BLOCK_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/block';
import type { UmbBlockDataModel } from '@umbraco-cms/backoffice/block';
import type { Observable } from '@umbraco-cms/backoffice/external/rxjs';
import type { UmbVariantId } from '@umbraco-cms/backoffice/variant';

/** The block property NestingContently toggles — Umbraco's convention navi-hide property. */
export const PROPERTY_ALIAS = 'umbracoNaviHide';

/**
 * Observable of the variant id for `umbracoNaviHide` on the given block element's content type,
 * or `undefined` when that element type does not declare the property.
 *
 * The observable is backed by the content-type structure, so it re-emits as the structure loads:
 * observe it to react over time, or sample the first value when a one-off answer is enough.
 * Returns `undefined` (not an observable) when there is no element data, or its structure is not
 * yet known to the block manager.
 *
 * Shared by the toggle-visibility action (which resolves the target element to write) and the
 * condition that gates the action's button, so both agree on where the property lives.
 */
export async function naviHideVariantId(
  entry: typeof UMB_BLOCK_ENTRY_CONTEXT.TYPE,
  manager: typeof UMB_BLOCK_MANAGER_CONTEXT.TYPE,
  data: UmbBlockDataModel | undefined,
): Promise<Observable<UmbVariantId | undefined> | undefined> {
  if (!data) {
    return undefined;
  }

  const structure = manager.getStructure(data.contentTypeKey);
  if (!structure) {
    return undefined;
  }

  return entry.propertyVariantId(structure, PROPERTY_ALIAS);
}
