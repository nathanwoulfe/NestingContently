(() => {
    function nestingContently($scope, $element) {
        const propElm = $element[0].closest('.umb-nested-content-property-container');
        if (propElm) {
            propElm.style.display = 'none';
        }

        // find the key for this NC panel, to use as a guard
        // when receiving the ncDisabledToggle event
        let ncScope = $scope.$parent.$parent;
        do {
            ncScope = ncScope.$parent;
        } while (!Object.prototype.hasOwnProperty.call(ncScope, 'ngModel'));

        const key = ncScope.ngModel.key;

        $scope.$on('ncDisabledToggle', (e, data) => {
            if (key === data.key) {
                $scope.model.value = data.value;
            }
        });
    }

    angular.module('umbraco').controller('nestingContentlyController', ['$scope', '$element', nestingContently]);
})();