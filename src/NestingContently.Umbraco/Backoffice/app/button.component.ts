class ButtonComponentController {

  prop: Record<string, any> = {};
  labels = {};
  disabled = false;
  type;
  node;
  iconTitle = '';
  enable = '';
  disable = '';

  constructor(
    private $element,
    private localizationService,
    private ncStrings) {

  }

  $onInit = async () => {

    if (!this.node) {
      return;
    }

    [this.enable, this.disable] = await this.localizationService.localizeMany(['actions_enable', 'actions_disable']);

    let activeVariant = this.node.settings.variants.find(x => x.active);
    activeVariant = activeVariant ?? this.node.settings.variants[0];
    let property;

    activeVariant.tabs.forEach(tab => {
      tab.properties.forEach(prop => {
        if (prop.alias === 'umbracoNaviHide') {
          property = prop;
          return;
        }
      });

      if (property) {
        return;
      }
    })

    this.prop = property;

    if (this.prop) {
      this.disabled = this.prop.value === '1';

      this.setTitle();

      if (this.disabled) {
        this.setClass('add');
      }
    } else {
      this.$element[0].style.display = 'none';
    }
  }

  setClass = fn => this.$element.closest(this.ncStrings[this.type].itemClass)[0]
    .classList[fn](this.ncStrings[this.type].disabledClass);

  setTitle = () => this.iconTitle = this.disabled ? this.enable : this.disable;

  toggle = () => {
    this.disabled = !this.disabled;
    this.prop.value = this.disabled ? '1' : '0';
    this.setTitle();
    this.setClass('toggle');
  };
}

const template =
  `<button type="button" class="umb-nested-content__icon umb-nested-content__icon--disable" 
		title="{{ $ctrl.iconTitle }}" 
		ng-click="$ctrl.toggle(); $event.stopPropagation()">
		<i class="icon icon-power" aria-hidden="true"></i>
		<span class="sr-only">
			{{ $ctrl.iconTitle }}
		</span>
	</button>`;

export const ButtonComponent = {
  name: 'ncToggle',
  transclude: true,
  template,
  bindings: {
    node: '<',
    index: '<',
    type: '@'
  },
  controller: ButtonComponentController
};
