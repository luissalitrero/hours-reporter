import angular from 'angular';
import _ from 'lodash';

import templateUrl from './alertsSection.html';

import './alertsSection.css';

class AlertsSection {
  constructor($rootScope, $timeout) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.$timeout = $timeout;

    this.$rootScope.alerts = [];
  }

  autoCloseAfter(miliseconds, alert) {
    alert.id = Date.now();

    this.$timeout(() => {
      this.closeAlert(alert.id);
    }, miliseconds);
  }

  closeAlert(alertId) {
    let alertIndex = _.findIndex(this.$rootScope.alerts, {id: alertId});

    this.$rootScope.alerts.splice(alertIndex, 1);
  };
}

const name = 'alertsSection';

angular
  .module(name, [])
  .component(name, {
    templateUrl,
    controllerAs: name,
    controller: ['$rootScope', '$timeout', AlertsSection]
  });

export default name;
