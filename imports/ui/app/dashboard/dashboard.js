import angular from 'angular';

import templateUrl from './dashboard.html';
import CaptureGrid from '../captureGrid/captureGrid';

class Dashboard {}

const name = 'app.dashboard';

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
