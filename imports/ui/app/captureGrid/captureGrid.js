import angular from 'angular';
import {Meteor} from 'meteor/meteor';

import templateUrl from './captureGrid.html';
import DatePicker from '../datePicker/datePicker';
import CreateTimesheet from '../createTimesheet/createTimesheet';
import {Timesheets} from '/imports/api/timesheets';

import './captureGrid.css';

class CaptureGrid {
  constructor($scope, $reactive, $rootScope, $element) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('timesheets');

    this.$rootScope = $rootScope;
    this.$element = $element;
    this.user = Meteor.user();

    this.dateSelected = {};
  }

  $onInit() {
    this.searchTimesheetsByUserId(this.user._id);

    let dateSelectedListener = this.$rootScope.$on('DATE_SELECTED', (event, args) => {
      event.preventDefault();

      this.searchTimesheet(args.userId, args.componentDateSelected);
    });

    this.$element.on('$destroy', () => {
      dateSelectedListener();
    });
  }

  //setDateSelected(dateSelected) {
//console.log('-----000--',dateSelected);
  //  this.dateSelected = dateSelected;
  //  this.blabla = 'blabla';
  //  this.scope.$apply();
  //}

  searchTimesheet(userId, componentDateSelected) {
    this.dateSelected = componentDateSelected;
    this.timesheet = Timesheets.findOne({userId: userId, dateTo: componentDateSelected});

//console.log('-----0--',userId, componentDateSelected);
//console.log('-----1--',this.timesheet);

    if (!this.timesheet) {
      this.$rootScope.alerts.push({
        type: 'info',
        msg: 'There is no timesheet for the specified pay period ending.'
      });
    }
  }

  searchTimesheetsByUserId(userId) {
    this.timesheets = Timesheets.find({userId: userId});

    if (!this.timesheets.count()) {
      this.$rootScope.alerts.push({
        type: 'info',
        msg: 'There are no timesheets registered.'
      });
    }
  }
}

const name = 'captureGrid';

angular
  .module(name, [
    DatePicker,
    CreateTimesheet
  ])
  .component(name, {
    templateUrl,
    controllerAs: name,
    controller: ['$scope', '$reactive', '$rootScope', '$element', CaptureGrid]
  });

export default name;
