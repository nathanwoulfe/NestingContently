(() => {

    // stuff the toggle directive into the nested content template
    function interceptor($q) {
        return {
            response: resp => {
                if (resp.config.url.toLowerCase().indexOf('/propertyeditors/nestedcontent/nestedcontent.html') !== -1) {
                    if (location.href.indexOf('content') !== -1) {                    
                        const str = '<a class="nested-content__icon nested-content__icon--delete"';
                        resp.data = resp.data.replace(str, '<nc-toggle></nc-toggle>'+ str);
                    }
                }
                return resp || $q.when(resp);
            }
        }; 
    }

    angular.module('umbraco').factory('nestingContentlyInterceptor', ['$q', interceptor]);
    
    // add the interceptor, if it doesn't exist already
    angular.module('umbraco')
        .config(function ($httpProvider) {
            if ($httpProvider.interceptors.indexOf('nestingContentlyInterceptor') === -1) {
                $httpProvider.interceptors.push('nestingContentlyInterceptor');
            }
        });

})(); 
