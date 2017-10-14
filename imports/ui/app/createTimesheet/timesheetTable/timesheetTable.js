import angular from 'angular';

import templateUrl from './timesheetTable.html';

class TimesheetTable {
  constructor() {
    'ngInject';
  }

  $onInit() {}
}

const name = 'timesheetTable';

angular
  .module(name, [])
  .component(name, {
    bindings: {
      repeatLimits: '@'
    },
    templateUrl,
    controllerAs: name,
    controller: [TimesheetTable]
  });

export default name;
