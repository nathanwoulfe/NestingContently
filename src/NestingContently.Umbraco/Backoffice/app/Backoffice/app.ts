import { ButtonComponent } from './button.component';

const name = 'nesting.contently';

const componentsModule = angular.module('nc.components', [])
  .component(ButtonComponent.name, ButtonComponent)
  .name;

angular.module(name, [componentsModule]);
angular.module('umbraco').requires.push(name);

const blPattern = /<div class="umb-block-list__block--actions">/gmi;
const blString = '$&<nc-toggle node="vm.layout.$block" selector="list"></nc-toggle>';

const bgPattern = /<div class="umb-block-grid__block--actions">/gmi;
const bgString = '$&<nc-toggle node="vm.layoutEntry.$block" selector="grid"></nc-toggle>';

for (let q of angular.module('umbraco')._invokeQueue) {
  let queueItem = q[2][0];

  if (queueItem === 'umbBlockListRow') {
    q[2][1].template = q[2][1].template.replace(blPattern, blString);
  }
  else if (queueItem === 'umbBlockGridEntry') {
    q[2][1].template = q[2][1].template.replace(bgPattern, bgString);
  }
}
