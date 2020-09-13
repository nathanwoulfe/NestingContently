(() => {
    'use strict';

    function controller($element, $rootScope, locale, strings) {

        let prop = {};
        let labels = {}; 
        let disabled = false;

        locale.localizeMany(['actions_enable','actions_disable']).then(data => {
            labels.enable = data[0];  
            labels.disable = data[1];
        }); 

        const setClass = fn => $element.closest(strings.itemClass)[0].classList[fn](strings.disabledClass);
        const setTitle = () => this.iconTitle = disabled ? labels.enable : labels.disable;        
        const setDisabledClass = () => this.disabledClass = disabled ? strings.disabledClass : '';
        
        this.toggle = () => {
            disabled = !disabled;
            prop.value = disabled ? '1' : '0';

            $rootScope.$broadcast('ncDisabledToggle', { value: prop.value, key: this.node.key });

            setTitle();
            setDisabledClass();
            setClass('toggle');
        };

        this.$onInit = () => {
            if (this.node) {  
                const props = this.node.variants[0].tabs[0]
                    .properties.filter(p => p.editor === strings.editorName);

                if (props.length === 1) {
                    prop = props[0];
                    disabled = prop.value === '1';

                    setTitle();
                    setDisabledClass();
                    
                    if (disabled) {
                        setClass('add');
                    }
                } else {
                    $element[0].style.display = 'none';
                }
            }
        };
    }
 
    const template = `
        <button type="button" class="umb-nested-content__icon umb-nested-content__icon--disable" 
            title="{{ $ctrl.iconTitle }}" 
            ng-click="$ctrl.toggle(); $event.stopPropagation()" 
            ng-class="$ctrl.disabledClass">
            <i class="icon icon-power" aria-hidden="true"></i>
            <span class="sr-only">
                <localize key="general_disable">Disable</localize>
            </span>
        </button>`;

    const component = {
        transclude: true,
        bindings: {
            node: '<',
            index: '<'
        },
        controller: controller,
        template: template
    };

    controller.$inject = ['$element', '$rootScope', 'localizationService', 'ncStrings'];

    angular.module('nc.components').component('ncToggle', component);
})();
