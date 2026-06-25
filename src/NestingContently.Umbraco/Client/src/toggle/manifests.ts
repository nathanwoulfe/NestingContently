const manifest: UmbExtensionManifest = {
  type: 'blockAction',
  kind: 'default',
  alias: 'NestingContently.BlockAction.ToggleVisibility',
  name: 'NestingContently Toggle Visibility',
  weight: 5,
  forBlockEditor: ['block-list', 'block-grid'],
  api: () => import('./toggle-visibility.action.js'),
  meta: {
    icon: 'icon-power',
    label: 'Toggle visibility',
  },
};

export const manifests: Array<UmbExtensionManifest> = [manifest];
