(() => {
    function nestingContently($scope, $element) {
        // get the closest nested content property, or generic umb property if no NC
        let propElm = $element[0].closest('.umb-nested-content-property-container');
        let isNc = propElm != null;

        propElm = propElm || $element[0].closest('umb-property');

        if (propElm) {
            propElm.style.display = 'none';
        }

        // NestedContent needs events to work, due to binding craziness
        // BlockList does not, so we can guard this entire block
        if (isNc) {
            let scope = $scope.$parent.$parent;
            do {
                scope = scope.$parent;
            } while (!Object.prototype.hasOwnProperty.call(scope, 'ngModel'));

            const key = scope.ngModel.key;

            $scope.$on('ncDisabledToggle', (e, data) => {
                if (key === data.key) {
                    $scope.model.value = data.value;
                }
            });
        }
    }

    angular.module('umbraco').controller('nestingContentlyController', ['$scope', '$element', nestingContently]);
})();