import angular from 'angular';

import templateUrl from './alertsSection.html';

import './alertsSection.css';

class AlertsSection {
  constructor($rootScope) {
    'ngInject';

    this.$rootScope = $rootScope;

    this.$rootScope.alerts = [];
  }

  closeAlert(index) {
    this.$rootScope.alerts.splice(index, 1);
  };
}

const name = 'alertsSection';

angular
  .module(name, [])
  .component(name, {
    templateUrl,
    controllerAs: name,
    controller: ['$rootScope', AlertsSection]
  });

export default name;
