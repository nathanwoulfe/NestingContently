(() => {

    angular.module('nc.components', []);

    angular
        .module('nc', [
            'nc.components'
        ])
        .constant('ncStrings', {
            editorName: 'NestingContently',
            nc: {
                disabledClass: 'umb-nested-content__item--disabled',
                itemClass: '.umb-nested-content__item',                
            },
            bl: {
                disabledClass: 'umb-block-list__block--disabled',
                itemClass: '.umb-block-list__block',
            }
        });

    angular.module('umbraco').requires.push('nc');
    
    for (let q of angular.module('umbraco')._invokeQueue) {
        let queueItem = q[2][0];

        if (queueItem === 'nestedContentPropertyEditor') { 
            const pattern = /<div class="umb-nested-content__icons">/gmi;
            q[2][1].template = q[2][1].template.replace(pattern, '$&<nc-toggle node="node" index="$index" type="nc"></nc-toggle>'); 
        } else if (queueItem === 'umbBlockListRow') {
            const pattern = /<div class="umb-block-list__block--actions">/gmi;
            q[2][1].template = q[2][1].template.replace(pattern, '$&<nc-toggle node="vm.layout.$block" index="vm.index" type="bl"></nc-toggle>');
            console.log(q[2][1].template);
        }
    }
    
})();
