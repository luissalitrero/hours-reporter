import angular from 'angular';

import templateUrl from './dashboard.html';

class Dashboard {
  constructor() {
    'ngInject';
  }
}

const name = 'dashboard';

angular
  .module(name, [])
  .config(config);

export default name;

function config($stateProvider) {
  $stateProvider
    .state('app.dashboard', {
      url: '/dashboard',
      templateUrl,
      controllerAs: name,
      controller: Dashboard
    });
}

config.$inject = ['$stateProvider'];
