import angular from 'angular';

import CaptureGrid from '../captureGrid/captureGrid';
import templateUrl from './dashboard.html';

class Dashboard {
  constructor() {
    'ngInject';
  }
}

const name = 'dashboard';

angular
  .module(name, [
    CaptureGrid
  ])
  .config(config);

export default name;

function config($stateProvider) {
  $stateProvider
    .state('app.dashboard', {
      url: '/',
      templateUrl,
      controllerAs: name,
      controller: Dashboard
    });
}

config.$inject = ['$stateProvider'];
