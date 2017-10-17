import angular from 'angular';

import templateUrl from './timesheets.html'
import TimesheetsList from '../timesheetsList/timesheetsList';

const name = 'timesheets';

angular
  .module(name, [
    TimesheetsList
  ])
  .config(config);

export default name;

function config($stateProvider) {
  $stateProvider
    .state('app.timesheets', {
      abstract: true,
      url: '/timesheets',
      templateUrl
    });
}

config.$inject = ['$stateProvider'];
