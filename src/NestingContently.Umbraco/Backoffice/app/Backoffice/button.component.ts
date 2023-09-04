class ButtonComponentController {

  prop?: Record<string, any>;
  selector?: 'grid' | 'list';
  node;
  iconTitle = '';
  enable = '';
  disable = '';

  valueWatcher?: Function;

  constructor(
    private $scope,
    private $element,
    private localizationService) {

  }

  async $onInit() {
    if (!this.node && !this.node.content && !this.node.settings) {
      this.$element[0].style.display = 'none';
      return;
    }

    this.setProp();

    if (!this.prop) {
      this.$element[0].style.display = 'none';
      return;
    }

    [this.enable, this.disable] = await this.localizationService.localizeMany(['actions_enable', 'actions_disable']);

    this.setValueWatcher();
    this.setTitle();
    this.setClass();
  }

  $onDestroy() {
    this.valueWatcher ? this.valueWatcher() : {};
  }

  setProp() {
    const setProp = (src) => {
      if (!src) return;

      (src.variants.find(x => x.active) ?? src.variants[0]).tabs.forEach(tab => {
        tab.properties.forEach(prop => {
          if (prop.alias === 'umbracoNaviHide') {
            this.prop = prop;
            return;
          }
        });

        if (this.prop) return;        
      });
    }

    setProp(this.node.settings);

    if (!this.prop) {
      setProp(this.node.content);
    }
  }

  setValueWatcher() {
    this.valueWatcher = this.$scope.$watch(() => this.prop!.value, (newVal, oldVal) => {
      if (!newVal) return;      

      this.setTitle();
      this.setClass();

      if (newVal !== oldVal) {
        this.node._parentForm.$setDirty();
      }
    });
  }

  setClass() {
    if (!this.selector) return;    

    const elm = this.$element.closest(`.umb-block-${this.selector}__block`)[0]

    if (!elm) return;

    elm.style.opacity = this.prop!.value !== '1' ? '1' : '0.5';
  }

  setTitle() {
    this.iconTitle = this.prop!.value !== '1' ? this.disable : this.enable;
  }

  toggle() {
    this.prop!.value = this.prop!.value !== '1' ? '1' : '0';
  }
}

const template =
  `<button type="button" class="btn-reset umb-outline action --settings" title="{{ $ctrl.iconTitle }}" ng-click="$ctrl.toggle()">
		<umb-icon icon="icon-power"></umb-icon>
		<span class="sr-only" ng-bind="$ctrl.iconTitle"></span>
	</button>`;

export const ButtonComponent = {
  name: 'ncToggle',
  transclude: true,
  template,
  bindings: {
    node: '<',
    selector: '@'
  },
  controller: ButtonComponentController
};
