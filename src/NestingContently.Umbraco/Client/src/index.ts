import { manifests as actionManifests } from './action/manifests.js';
import { manifests as conditionManifests } from './condition/manifests.js';

// Aggregated extension manifests for the NestingContently package.
export const manifests: Array<UmbExtensionManifest> = [...actionManifests, ...conditionManifests];
