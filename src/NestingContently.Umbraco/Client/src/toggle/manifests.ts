import type { ManifestBlockAction } from '@umbraco-cms/backoffice/block';

const manifest: ManifestBlockAction = {
  type: 'blockAction',
  alias: 'NestingContently.BlockAction.ToggleVisibility',
  name: 'NestingContently Toggle Visibility',
  weight: 5,
  forBlockEditor: ['block-list', 'block-grid'],
  element: () => import('./toggle-visibility.element.js'),
  api: () => import('./toggle-visibility.action.js'),
  meta: {
    icon: 'icon-power',
    label: 'Toggle visibility',
  },
};

export const manifests: Array<ManifestBlockAction> = [manifest];
