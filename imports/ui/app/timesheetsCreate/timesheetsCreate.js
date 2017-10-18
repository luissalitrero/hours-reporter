import angular from 'angular';
import {Meteor} from 'meteor/meteor';

import {Timesheets} from '/imports/api/timesheets';

import templateUrl from './timesheetsCreate.html';
import DatePicker from '../datePicker/datePicker';

import './timesheetsCreate.css';

class CaptureGrid {
  constructor($scope, $reactive, $stateParams, $rootScope, $state, $element) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$element = $element;

    //this.createTs = $stateParams.createTs;
    this.userId = $stateParams.userId;
    this.user = Meteor.users.findOne({"_id": this.userId});
    this.dateSelected = {};

    if (!this.user) {
      this.$rootScope.alerts.push({
        type: `danger`,
        msg: `The user specified wasn't found.`
      });

      this.$state.go('app.dashboard');

      throw new Meteor.Error('USER_NOT_FOUND');
    }

    this.subscribe('timesheets.listByUserId', () => [this.getReactively('userId')]);

    this.helpers({
      timesheets() {
        return Timesheets.find();
      }
    });
  }

  $onInit() {
    let dateSelectedListener = this.$rootScope.$on('DATE_SELECTED', (event, args) => {
      event.preventDefault();

      this.checkIfTimesheetExists(this.user, args.componentDateSelected);
    });

    this.$element.on('$destroy', () => {
      dateSelectedListener();
    });
  }

  checkIfTimesheetExists(user, dateSelected) {
    this.timesheet = null;

    this.call('timesheet.getByUserIdAndDate', user._id, dateSelected, (error, timesheet) => {
      if (error) {
        this.$rootScope.alerts.push({
          type: `danger`,
          msg: `An error occurred, please try again.`
        });
      }

      if (!timesheet) {
        this.createTs = true;

        this.generateTimesheetObject(dateSelected, user._id, user.username);
      } else {
        this.createTs = false;
        this.timesheet = timesheet;
      }
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
    Meteor.call('timesheet.createOrUpdate', angular.copy(timesheet), this.createTs, (error, result) => {
      if (error) {
        this.$rootScope.alerts.push({
          type: 'danger',
          msg: `An error occurred, please try again.`
        });

        throw new Meteor.Error('CANT-CREATE-TIMESHEET');
      }

      console.log('----0-timesheet-created--',result);
    });
  }
}

const name = 'timesheetsCreate';

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
      template: '<timesheets-create></timesheets-create>',
      params: {
        editing: false
      },
      pageTitle: 'Create timesheet'
    })
    .state('app.timesheets.details', {
      url: '/:timesheetId',
      template: '<timesheets-create></timesheets-create>',
      params: {
        editing: true
      },
      pageTitle: 'Timesheet Details'
    });
}

config.$inject = ['$stateProvider'];
