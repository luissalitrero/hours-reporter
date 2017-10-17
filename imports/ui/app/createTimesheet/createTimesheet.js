import angular from 'angular';
import {Meteor} from 'meteor/meteor';

import templateUrl from './createTimesheet.html';
import DatePicker from '../datePicker/datePicker';

import './createTimesheet.css';

class CaptureGrid {
  constructor($scope, $reactive, $stateParams, $rootScope, $state, $element) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$element = $element;

    this.createTs = $stateParams.createTs;
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

  saveTs(timesheet) {
    Meteor.call('timesheet.create', angular.copy(timesheet), (error, result) => {
      if (error) {
        this.$rootScope.alerts.push({
          type: 'danger',
          msg: `The timesheet couldn't be created.`
        });

        throw new Meteor.Error('CANT-CREATE-TIMESHEET');
      }

      console.log('----0-timesheet-created--',result);
    });
  }
}

const name = 'createTimesheet';

angular
  .module(name, [
    DatePicker
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
    .state('app.timesheets.create', {
      url: '/create/:userId',
      template: '<create-timesheet></create-timesheet>',
      params: {
        createTs: true
      },
      pageTitle: 'Create timesheet'
    })
    .state('app.timesheets.details', {
      url: '/:timesheetId',
      template: '<create-timesheet></create-timesheet>',
      params: {
        createTs: false
      },
      pageTitle: 'Timesheet Details'
    });
}

config.$inject = ['$stateProvider'];
