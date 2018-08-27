(() => {

    // stuff the toggle directive into the nested content template
    // this could be done using content events, but that then means the injected directive would need to be compiled
    // while this is a bit flakey, it ensures the directive is in the DOM when the digest cycle runs so should be more efficient
    // passing the prefix in to the directive allows construction of correct class names
    function interceptor($q) {
        return {
            response: resp => {
                if (resp.config.url.toLowerCase().indexOf('/propertyeditors/nestedcontent/nestedcontent.html') !== -1) {
                    if (location.href.indexOf('content') !== -1) {                    
                        const pattern = /<a class="(umb-)?nested-content__icon (umb-)?nested-content__icon--delete"/gmi;
                        resp.data = resp.data.replace(pattern, '<nc-toggle prefix="$1"></nc-toggle>$&'); 
                    }
                } 
                return resp || $q.when(resp);
            }
        }; 
    }

    angular.module('umbraco').factory('nestingContentlyInterceptor', ['$q', interceptor]);
    
    // add the interceptor, if it doesn't exist already.
    function add($httpProvider) {
        if ($httpProvider.interceptors.indexOf('nestingContentlyInterceptor') === -1) {
            $httpProvider.interceptors.push('nestingContentlyInterceptor');
        }
    }
    angular.module('umbraco').config(['$httpProvider', add]);

})();
 