import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Timesheets} from './collection'

Meteor.methods({
  'timesheet.getByUserId'(userId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    check(userId, String);

    Timesheets.find({"user._id": userId});
  },
  'timesheet.create'(timesheet) {
    if (!Meteor.userId() || Meteor.userId() !== timesheet.user._id) {
      throw new Meteor.Error('not-authorized');
    }

    check(timesheet.days, Array);
    check(timesheet.days.length, Match.Where((length) => length === 14));
    check(timesheet.payPeriodEnding, Date);
    check(timesheet.user, {username: String, _id: String});

    Timesheets.insert(timesheet);
  }
});
