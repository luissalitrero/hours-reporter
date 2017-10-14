import angular from 'angular';
import {Meteor} from 'meteor/meteor';

import templateUrl from './createTimesheet.html';
import DatePicker from '../datePicker/datePicker';
import TimesheetTable from './timesheetTable/timesheetTable';
import {Timesheets} from '/imports/api/timesheets';
import {Users} from '/imports/api/users';

import './createTimesheet.css';

class CaptureGrid {
  constructor($scope, $reactive, $stateParams, $rootScope, $state, $element) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('timesheets');

    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$element = $element;

    this.userId = $stateParams.userId;
    this.user = Meteor.users.findOne({"_id": this.userId});
    this.timesheet = null;

    if (!this.user) {
      this.$rootScope.alerts.push({
        type: 'danger',
        msg: `The user specified wasn't found.`
      });

      this.$state.go('app.dashboard');

      throw new Meteor.Error('USER_NOT_FOUND');
    }

    this.dateSelected = {};
  }

  $onInit() {
    let dateSelectedListener = this.$rootScope.$on('DATE_SELECTED', (event, args) => {
      event.preventDefault();

      this.timesheet = {};

      this.generateTimesheetObject(args.componentDateSelected, this.userId, this.user.username);
    });

    this.$element.on('$destroy', () => {
      dateSelectedListener();
    });
  }

  generateTimesheetObject(dateSelected, userId, username) {
    this.notes = {};

    this.timesheet = {
      payPeriodEnding: dateSelected,
      user: {
        _id: userId,
        username: username
      },
      days: []
    };

    let date = moment(this.timesheet.payPeriodEnding).subtract(13, 'days');

    for (let i = 0; i < 14; i++) {
      let dateTimestamp = Date.now() + i;

      this.timesheet.days.push({
        date: new Date(date.toDate()),
        dateTimestamp: dateTimestamp,
        notes: []
      });

      this.notes[dateTimestamp] = {timestamp: dateTimestamp, text: ''};

      date.add(1, 'd');
    }
  }

  addNote(day, note) {
    day.notes.push(angular.copy(note));

    note.text = '';
  }
}

const name = 'createTimesheet';

angular
  .module(name, [
    DatePicker,
    TimesheetTable
  ])
  .config(config)
  .component(name, {
    templateUrl,
    controllerAs: name,
    controller: ['$scope', '$reactive', '$stateParams', '$rootScope', '$state', '$element', CaptureGrid]
  });

export default name;

function config($stateProvider) {
  $stateProvider
    .state('app.create-timesheet', {
      url: '/create-timesheet/:userId',
      template: '<create-timesheet></create-timesheet>',
      pageTitle: 'Create timesheet'
    });
}

config.$inject = ['$stateProvider'];
