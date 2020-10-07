angular.module('nc.components', []);

angular
	.module('nc', [
		'nc.components'
	])
	.constant('ncStrings', {
		editorName: 'NestingContently',
		nc: {
			disabledClass: 'umb-nested-content__item--disabled',
			itemClass: '.umb-nested-content__item',
		},
		bl: {
			disabledClass: 'umb-block-list__block--disabled',
			itemClass: '.umb-block-list__block',
		}
	});

angular.module('umbraco').requires.push('nc');

const ncPattern = /<div class="umb-nested-content__icons">/gmi;
const blPattern = /<div class="umb-block-list__block--actions">/gmi;

const ncString = '$&<nc-toggle node="node" index="$index" type="nc"></nc-toggle>';
const blString = '$&<nc-toggle node="vm.layout.$block" index="vm.index" type="bl"></nc-toggle>';

for (let q of angular.module('umbraco')._invokeQueue) {
	let queueItem = q[2][0];

	if (queueItem === 'nestedContentPropertyEditor') {
		q[2][1].template = q[2][1].template.replace(ncPattern, ncString);
	} else if (queueItem === 'umbBlockListRow') {
		q[2][1].template = q[2][1].template.replace(blPattern, blString);
	}
}
