(() => {
    // for this to work, we need a property editor, we don't, however, need it to be visible or edited...
    function nestingContently($element) {
        const propElm = $element[0].closest('.umb-nested-content-property-container');

        if (propElm) {
            propElm.style.display = 'none';
        }
    }

    angular.module('umbraco').controller('nestingContentlyController', ['$element', nestingContently]);
})();