(() => {
	'use strict';

	function controller($element, $rootScope, locale, strings) {

		let prop = {};
		let labels = {};
		let disabled = false;

		locale.localizeMany(['actions_enable', 'actions_disable']).then(data => {
			let [enable, disable] = data;
			labels = { enable, disable };
		});

		const setClass = fn => $element.closest(strings[this.type].itemClass)[0]
			.classList[fn](strings[this.type].disabledClass);

		const setTitle = () => this.iconTitle = disabled ? labels.enable : labels.disable;

		this.toggle = () => {
			disabled = !disabled;
			prop.value = disabled ? '1' : '0';

			if (this.type === 'nc') {
				$rootScope.$broadcast('ncDisabledToggle', { value: prop.value, key: this.node.key });
			}

			setTitle();
			setClass('toggle');
		};

		this.$onInit = () => {
			if (this.node) {
				prop = (this.type === 'nc' ? this.node : this.node.content).variants[0].tabs[0]
					.properties.find(p => p.editor === strings.editorName);

				if (prop) {
					disabled = prop.value === '1';

					setTitle();

					if (disabled) {
						setClass('add');
					}
				} else {
					$element[0].style.display = 'none';
				}
			}
		};
	}

	const template = `
		<button type="button" class="umb-nested-content__icon umb-nested-content__icon--disable" 
			title="{{ $ctrl.iconTitle }}" 
			ng-click="$ctrl.toggle(); $event.stopPropagation()">
			<i class="icon icon-power" aria-hidden="true"></i>
			<span class="sr-only">
				{{ $ctrl.iconTitle }}
			</span>
		</button>`;

	const component = {
		transclude: true,
		bindings: {
			node: '<',
			index: '<',
			type: '@'
		},
		controller: controller,
		template: template
	};

	controller.$inject = ['$element', '$rootScope', 'localizationService', 'ncStrings'];

	angular.module('nc.components').component('ncToggle', component);
})();
