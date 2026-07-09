import { TOGGLE_VISIBILITY_CONDITION_ALIAS } from './constants.js';
import { NestingContentlyToggleVisibilityCondition } from './toggle-visibility.condition.js';

const manifest: UmbExtensionManifest = {
  type: 'condition',
  alias: TOGGLE_VISIBILITY_CONDITION_ALIAS,
  name: 'Nesting Contently Block Has Visibility Toggle Condition',
  api: NestingContentlyToggleVisibilityCondition,
};

export const manifests: Array<UmbExtensionManifest> = [manifest];
