(() => {

    const template = `
        <a class="nested-content__icon nested-content__icon--disable" 
                title="{{ iconTitle }}" 
                node="$parent.nodes[$index]"
                ng-click="toggle($index); $event.stopPropagation();" 
                ng-class="{ 'nested-content__icon--disabled' : disabled }" prevent-default>
            <i class="icon icon-power"></i>
        </a>`; 
 
    function ncToggle($rootScope) {
        const dir = {
            restrict: 'E', 
            template: template,
            link: (scope, element) => { 

                let prop = {};
                scope.disabled = false; 

                scope.$watch('node', (a, b) => {
                    if (scope.node) {
                        const props = scope.node.tabs[0].properties.filter(p => p.editor === 'NestingContently');
                         
                        if (props.length === 1) {
                            prop = props[0];
                            scope.disabled = +prop.value === 1;
                            scope.iconTitle = scope.disabled ? 'Enable' : 'Disable';
                        } else {
                            element[0].style.display = 'none';
                        }
                    }
                }, true);

                scope.toggle = idx => {
                    scope.disabled = !scope.disabled;
                    scope.iconTitle = scope.disabled ? 'Enable' : 'Disable';

                    prop.value = scope.disabled ? 1 : 0;

                    scope.$parent.model.value[idx].disabled = prop.value;
                    scope.$parent.$parent.$parent.model.value[idx].disabled = prop.value;
                }
            }
        };

        return dir;
    }

    angular.module('umbraco').directive('ncToggle', ['$rootScope', ncToggle]);
})();
