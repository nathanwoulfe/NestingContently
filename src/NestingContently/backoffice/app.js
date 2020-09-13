(() => {

    angular.module('nc.components', []);

    angular
        .module('nc', [
            'nc.components'
        ])
        .constant('ncStrings', {
            disabledClass: 'umb-nested-content__item--disabled',
            itemClass: '.umb-nested-content__item',
            editorName: 'NestingContently'
        });

    angular.module('umbraco').requires.push('nc');
    
    for (let q of angular.module('umbraco')._invokeQueue) {
        if (q[2][0] === 'nestedContentPropertyEditor') { 
            const pattern = /<div class="umb-nested-content__icons">/gmi;
            q[2][1].template = q[2][1].template.replace(pattern, '$&<nc-toggle node="node" index="$index"></nc-toggle>'); 
        }
    }
    
})();
