(() => {
    // for this to work, we need a property editor, we don't, however, need it to be visible or edited...
    function nestingContently($element) {
        const findAncestor = (el, cls) => {
            while ((el = el.parentElement) && !el.classList.contains(cls));
            return el;
        }
        
        const propElm = findAncestor($element[0], 'umb-property');

        if (propElm) {
            var parentElem = propElm.parentElement;
            if (parentElem.classList.contains('umb-nested-content-property-container')) {
                parentElem.style.display = 'none';
            }
        }
    } 

    angular.module('umbraco').controller('nestingContentlyController', ['$element', nestingContently]);
})();

