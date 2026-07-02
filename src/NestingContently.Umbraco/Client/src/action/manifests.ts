import { NestingContentlyToggleAction } from "./toggle-visibility.action.js";

const manifest: UmbExtensionManifest = {
  type: 'blockAction',
  kind: 'default',
  alias: 'NestingContently.BlockAction.ToggleVisibility',
  name: 'Nesting Contently Toggle Visibility',
  weight: 110,
  forBlockEditor: ['block-list', 'block-grid'],
  api: NestingContentlyToggleAction,
  meta: {
    icon: 'icon-power',
    label: 'Toggle visibility',
  },
};

export const manifests: Array<UmbExtensionManifest> = [manifest];
