import angular from 'angular';
import {Meteor} from 'meteor/meteor';

import templateUrl from './captureGrid.html';
import DatePicker from '../datePicker/datePicker';
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
    //this.searchTimesheet(this.user._id);

    let dateSelectedListener = this.$rootScope.$on('DATE_SELECTED', (event, args) => {
      event.preventDefault();

      this.searchTimesheet(args.userId, args.componentDateSelected);
    });

    this.$element.on('$destroy', () => {
      dateSelectedListener();
    });
  }

  createTs(userId, dateSelected) {
    this.creatingTs = true;

    this.timesheet = {
      payPeriodEnding: this.dateSelected,
      user: {
        _id: $scope.user._id,
        userProfileName: $scope.user.profile.name
      },
      days: []
    };

    var date = moment(timesheet.payPeriodEnding).subtract(13, 'days');
    for (var i = 0; i < 14; i++) {
      timesheet.days.push({
        date: new Date(date.toDate()),
        descriptions: []
      });

      date.add(1, 'd');
    }
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

console.log('-----0--',userId, componentDateSelected);
console.log('-----1--',this.timesheet);

    if (!this.timesheet) {
      this.$rootScope.alerts.push({
        type: 'info',
        msg: 'There is no timesheet for the specified pay period ending.'
      });
    }
  }
}

const name = 'captureGrid';

angular
  .module(name, [
    DatePicker
  ])
  .component(name, {
    templateUrl,
    controllerAs: name,
    controller: ['$scope', '$reactive', '$rootScope', '$element', CaptureGrid]
  });

export default name;
