import {Meteor} from 'meteor/meteor';
import {Timesheets} from './collection';

Meteor.publish('timesheets.listByUserId', function (userId) {
  const selector = {
    "user._id": userId
  };

  return Timesheets.find(selector);
});
