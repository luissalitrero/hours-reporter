import angular from 'angular';

import templateUrl from './captureGrid.html';

import './captureGrid.css';

class CaptureGrid {
  constructor() {
    this.altInputFormats = ['M!/d!/yyyy'];
    this.dt = new Date();
    this.format = 'dd-MMMM-yyyy';
    this.opened = false;

    this.inlineOptions = {
      customClass: this.getDayClass,
      minDate: new Date(),
      showWeeks: true
    }

    this.dateOptions = {
      dateDisabled: this.disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 1
    }

    this.inlineOptions.minDate = this.inlineOptions.minDate ? null : new Date();
    this.dateOptions.minDate = this.inlineOptions.minDate;

    this.tomorrow = new Date();
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);

    this.afterTomorrow = new Date();
    this.afterTomorrow.setDate(this.tomorrow.getDate() + 1);

    this.events = [
      { date: this.tomorrow, status: 'full' },
      { date: this.afterTomorrow, status: 'partially' }
    ];
  }

  clear() { this.dt = null; }
  open() { this.opened = true; }

  disabled(data) {
    let date = data.date,
        mode = data.mode;

    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  getDayClass(data) {
    let date = data.date,
        mode = data.mode;

    if (mode === 'day') {
      let dayToCheck = new Date(date).setHours(0, 0, 0, 0);

      for (var i = 0; i < this.events.length; i++) {
        var currentDay = new Date(this.events[i].date).setHours(0, 0, 0, 0);

        if (dayToCheck === currentDay) {
          return this.events[i].status;
        }
      }
    }

    return '';
  }
}

const name = 'captureGrid';

angular
  .module(name, [])
  .component(name, {
    templateUrl,
    controllerAs: name,
    controller: [CaptureGrid]
  });

export default name;
