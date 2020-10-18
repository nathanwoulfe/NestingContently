angular.module('umbraco').directive('ncToggle', ['$rootScope', ($rootScope) => {
	const dir = {
		restrict: 'E',
		template: `
        <a class="{{ class }}" 
                title="{{ iconTitle }}" 
                node="$parent.nodes[$index]"
                ng-click="toggle($index); $event.stopPropagation();" 
                ng-class="disabledClass()" prevent-default>
            <i class="icon icon-power"></i>
        </a>`,
		link: (scope, element, attrs) => {
			let prop = {};
			let disabled = false;

			const prefix = attrs.prefix;
			const elementClass = `${prefix}nested-content__item--disabled`;

			scope.class = `${prefix}nested-content__icon ${prefix}nested-content__icon--disable`;
			scope.disabledClass = () => disabled ? `${prefix}nested-content__icon--disabled` : '';

			scope.$watch('node', (a, b) => {
				if (scope.node) {
					const props = scope.node.tabs[0].properties.filter(p => p.editor === 'NestingContently');

					if (props.length === 1) {
						prop = props[0];
						disabled = +prop.value === 1;
						scope.iconTitle = disabled ? 'Enable' : 'Disable';

						if (disabled) {
							element.closest('[class*=nested-content__item]')[0].classList.add(elementClass);
						}
					} else {
						element[0].style.display = 'none';
					}
				}
			}, true);

			scope.toggle = idx => {
				disabled = !disabled;
				scope.iconTitle = disabled ? 'Enable' : 'Disable';

				prop.value = disabled ? 1 : 0;

				scope.$parent.model.value[idx].disabled = disabled;
				scope.$parent.$parent.$parent.model.value[idx].disabled = disabled;

				element.closest('[class*=nested-content__item]')[0].classList.toggle(elementClass);
			}
		}
	};

	return dir;
}]);