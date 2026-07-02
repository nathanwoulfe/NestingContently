import { TOGGLE_VISIBILITY_CONDITION_ALIAS } from "../condition/constants.js";
import { NestingContentlyToggleAction } from "./toggle-visibility.action.js";

const manifest: UmbExtensionManifest = {
  type: 'blockAction',
  kind: 'default',
  alias: 'NestingContently.BlockAction.ToggleVisibility',
  name: 'Nesting Contently Toggle Visibility',
  weight: 110,
  forBlockEditor: ['block-list', 'block-grid'],
  api: NestingContentlyToggleAction,
  // Only show the button on blocks whose element type declares umbracoNaviHide; without this the
  // action renders on every block and is a silent no-op on blocks that cannot be hidden.
  conditions: [{ alias: TOGGLE_VISIBILITY_CONDITION_ALIAS }],
  meta: {
    icon: 'icon-power',
    label: 'Toggle visibility',
  },
};

export const manifests: Array<UmbExtensionManifest> = [manifest];
