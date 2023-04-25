import { ButtonComponent } from './button.component';

const name = 'nesting.contently';

const componentsModule = angular.module('nc.components', [])
  .component(ButtonComponent.name, ButtonComponent);

angular
	.module(name, [
    componentsModule,
	])
	.constant('ncStrings', {
		editorName: 'NestingContently',
		bl: {
			disabledClass: 'umb-block-list__block--disabled',
			itemClass: '.umb-block-list__block',
		}
	});

angular.module('umbraco').requires.push(name);

const blPattern = /<div class="umb-block-list__block--actions">/gmi;
const blString = '$&<nc-toggle node="vm.layout.$block" index="vm.index" type="bl"></nc-toggle>';

for (let q of angular.module('umbraco')._invokeQueue) {
	let queueItem = q[2][0];

	if (queueItem === 'umbBlockListRow') {
		q[2][1].template = q[2][1].template.replace(blPattern, blString);
	}
}
