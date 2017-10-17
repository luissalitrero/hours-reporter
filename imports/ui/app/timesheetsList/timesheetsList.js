import angular from 'angular';
import {Meteor} from 'meteor/meteor';

import templateUrl from './timesheetsList.html';
import DatePicker from '../datePicker/datePicker';
import CreateTimesheet from '../createTimesheet/createTimesheet';
import {Timesheets} from '/imports/api/timesheets';

import './timesheetsList.css';

class TimesheetsList {
  constructor($scope, $reactive, $rootScope, $element, $state, $stateParams) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$rootScope = $rootScope;
    this.$element = $element;
    this.user = Meteor.user();
    this.dateSelected = {};

    if (!this.user) {
      this.$state.go('login.login');

      throw new Meteor.Error('FORBIDDEN_GO_DASHBOARD');
    }

    const handle = Meteor.subscribe('timesheets.listByUserId', this.user._id);
    Tracker.autorun(() => {
      const isReady = handle.ready();
      const userId = this.user._id;
      let getTimesheets = function () {
        return Meteor.call('timesheet.getByUserId', userId, function (error, result) {
          if (error) { alert('Error retrieving timesheets'); }
          console.log('-----0--',result);
        });
      }
console.log('-----1--');
      isReady && getTimesheets();
    });

    //this.helpers({
    //  timesheets() {
    //    return Timesheets.find(this.userId);
    //  }
    //});
  }

  $onInit() {
    let dateSelectedListener = this.$rootScope.$on('DATE_SELECTED', (event, args) => {
      event.preventDefault();

      this.searchTimesheetsByUserIdAndDate(args.userId, args.componentDateSelected);
    });

    this.$element.on('$destroy', () => {
      dateSelectedListener();
    });

    //this.searchTimesheetsByUserId(this.user._id);
  }

  searchTimesheetsByUserId(userId) {
    this.timesheets = Timesheets.find({"user._id": userId});
console.log('-----1--',this.timesheets.count());

    if (!this.timesheets.count()) {
      this.$rootScope.alerts.push({
        type: 'info',
        msg: 'No timesheets found.'
      });
    }
  }

  searchTimesheetsByUserIdAndDate(userId, dateSelected) {
    this.timesheets = Timesheets.find({"user._id": userId});

    if (!this.timesheets.count()) {
      this.$rootScope.alerts.push({
        type: 'info',
        msg: 'No timesheets found.'
      });
    }

    //this.timesheet = Timesheets.findOne({"user._id": userId, "payPeriodEnding": this.dateSelected});
    //if (!this.timesheet) {
    //  this.$rootScope.alerts.push({
    //    type: 'info',
    //    msg: 'No timesheets found.'
    //  });
    //}
  }
}

const name = 'timesheetsList';

angular
  .module(name, [
    DatePicker,
    CreateTimesheet
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
