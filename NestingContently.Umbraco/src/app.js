angular.module('nc.components', []);

angular.module('nc', [
	'nc.components'
]);

angular.module('umbraco').requires.push('nc');

for (let q of angular.module('umbraco')._invokeQueue) {
	if (q[2][0] === 'nestedContentPropertyEditor') {
		const pattern = /<div class="umb-nested-content__icons">/gmi;
		q[2][1].template = q[2][1].template.replace(pattern, '$&<nc-toggle node="node" index="$index" model="$parent.$parent.model"></nc-toggle>');
	}
}