import angular from 'angular';
import {Meteor} from 'meteor/meteor';

import templateUrl from './timesheetsList.html';
import DatePicker from '../datePicker/datePicker';
import TimesheetsCreate from '../timesheetsCreate/timesheetsCreate';
import {Timesheets} from '/imports/api/timesheets';

import './timesheetsList.css';

class TimesheetsList {
  constructor($scope, $reactive, $rootScope, $element, $state, $stateParams) {
    'ngInject';

    $reactive(this).attach($scope);

    if (!Meteor.user()) {
      this.$state.go('login.login');

      throw new Meteor.Error('FORBIDDEN_GO_DASHBOARD');
    }

    this.$rootScope = $rootScope;
    this.$element = $element;
    this.user = Meteor.user();
    //this.dateSelected = {};
    this.userId = $stateParams.userId;

    this.subscribe('timesheets.listByUserId', () => [this.getReactively('userId')]);

    this.helpers({
      timesheets() {
        return Timesheets.find();
      }
    });
  }

  //searchTimesheetsByUserId(userId) {
    //this.timesheets = Timesheets.find({"user._id": userId});
//console.log('-----1--',this.timesheets.count());
//
    //if (!this.timesheets.count()) {
    //  this.$rootScope.alerts.push({
    //    type: 'info',
    //    msg: 'No timesheets found.'
    //  });
    //}
  //}

  //$onInit() {
  //  let dateSelectedListener = this.$rootScope.$on('DATE_SELECTED', (event, args) => {
  //    event.preventDefault();
//
  //    this.searchTimesheetsByUserIdAndDate(args.userId, args.componentDateSelected);
  //  });
//
  //  this.$element.on('$destroy', () => {
  //    dateSelectedListener();
  //  });
//
  //  //this.searchTimesheetsByUserId(this.user._id);
  //}

  //searchTimesheetsByUserIdAndDate(userId, dateSelected) {
  //  this.timesheets = Timesheets.find({"user._id": userId});
//
  //  if (!this.timesheets.count()) {
  //    this.$rootScope.alerts.push({
  //      type: 'info',
  //      msg: 'No timesheets found.'
  //    });
  //  }
//
  //  //this.timesheet = Timesheets.findOne({"user._id": userId, "payPeriodEnding": this.dateSelected});
  //  //if (!this.timesheet) {
  //  //  this.$rootScope.alerts.push({
  //  //    type: 'info',
  //  //    msg: 'No timesheets found.'
  //  //  });
  //  //}
  //}
}

const name = 'timesheetsList';

angular
  .module(name, [
    DatePicker,
    TimesheetsCreate
  ])
  .config(config)
  .component(name, {
    templateUrl,
    controllerAs: name,
    controller: ['$scope', '$reactive', '$rootScope', '$element', '$state', '$stateParams', TimesheetsList]
  });

export default name;

function config($stateProvider) {
  $stateProvider
    .state('app.timesheets.list', {
      url: '/list/:userId',
      template: '<timesheets-list></timesheets-list>',
      pageTitle: 'Timesheet list'
    });
}

config.$inject = ['$stateProvider'];
