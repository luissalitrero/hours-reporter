import angular from 'angular';
import {Meteor} from 'meteor/meteor';
import moment from 'moment-timezone';
import _ from 'lodash';

import templateUrl from './datePicker.html';

import './datePicker.css';

class DatePicker {
  constructor($rootScope) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.user = Meteor.user();
  }

  $onInit() {
    this.altInputFormats = ['M!/d!/yyyy'];
    this.closeText       = this.componentCloseText || 'Close';
    this.dt              = moment().tz('America/Los_Angeles').day(7).hours(12).minutes(0).seconds(0).milliseconds(0).toDate();
    this.format          = this.componentDatepickerPopup || 'dd-MMMM-yyyy';
    this.ngRequired      = _.isBoolean(this.componentNgRequired) ? this.componentNgRequired : true;
    this.opened          = _.isBoolean(this.componentIsOpen) ? this.componentIsOpen : true;
    this.readOnly        = _.isBoolean(this.componentReadOnly) ? this.componentReadOnly : true;

    this.dateOptions = this.componentDatepickerOptions || {
      dateDisabled: this.disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 0,
      showWeeks: false,
      onOpenFocus: false
    }

    this.selectDate();

    //this.inlineOptions = {
    //  customClass: this.getDayClass,
    //  minDate: new Date(),
    //  showWeeks: false
    //}
    //this.inlineOptions.minDate = this.inlineOptions.minDate ? null : new Date();
    //this.dateOptions.minDate = this.inlineOptions.minDate;
    //this.tomorrow = new Date();
    //this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    //this.afterTomorrow = new Date();
    //this.afterTomorrow.setDate(this.tomorrow.getDate() + 1);
    //this.events = [
    //  { date: this.tomorrow, status: 'full' },
    //  { date: this.afterTomorrow, status: 'partially' }
    //];
  }
  //getDayClass(data) {
  //  let date = data.date,
  //      mode = data.mode;
//
  //  if (mode === 'day') {
  //    let dayToCheck = new Date(date).setHours(0, 0, 0, 0);
//
  //    for (var i = 0; i < this.events.length; i++) {
  //      var currentDay = new Date(this.events[i].date).setHours(0, 0, 0, 0);
//
  //      if (dayToCheck === currentDay) {
  //        return this.events[i].status;
  //      }
  //    }
  //  }
//
  //  return '';
  //}

  clear() { this.dt = null; }
  openClose() { this.opened = !this.opened; }

  disabled(data) {
    let date = data.date;
    let mode = data.mode;

    return mode==='day' && date.getDay() !== 0;
  }

  //selectDate() {
  //  this.componentDateSelected(this.dt);
  //}

  selectDate() {
    this.componentDateSelected = this.dt;

    this.$rootScope.$emit('DATE_SELECTED', {userId: this.user._id, componentDateSelected: this.dt});
  }
}

const name = 'datePicker';

angular
  .module(name, [])
  .component(name, {
    bindings: {
      componentAltInputFormats: '=',
      componentCloseText: '@',
      componentDatepickerOptions: '=?',
      componentDatepickerPopup: '<',
      //componentDateSelected: '<',
      componentDateSelected: '=',
      componentIsOpen: '<',
      componentNgRequired: '<',
      componentReadOnly: '<'
    },
    templateUrl,
    controllerAs: name,
    controller: ['$rootScope', DatePicker]
  });

export default name;
