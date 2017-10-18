import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Timesheets} from './collection'

Meteor.methods({
  'timesheet.getByUserIdAndDate'(userId, payPeriodEnding) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const selector = {
      "user._id": userId
    };

    if (payPeriodEnding) {
      selector.payPeriodEnding = payPeriodEnding;
    }

    check(userId, String);
    check(payPeriodEnding, Date);

    return Timesheets.findOne(selector);
  },
  'timesheet.createOrUpdate'(timesheet, create) {
    if (!Meteor.userId() || Meteor.userId() !== timesheet.user._id) {
      throw new Meteor.Error('not-authorized');
    }

    check(timesheet.days, Array);
    check(timesheet.days.length, Match.Where((length) => length === 14));
    check(timesheet.payPeriodEnding, Date);
    check(timesheet.user, {username: String, _id: String});
    check(create, Boolean);

    if (create) { return Timesheets.insert(timesheet); }

    return Timesheets.update({"_id": timesheet._id}, timesheet);
  }
});
