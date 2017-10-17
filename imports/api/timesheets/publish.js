import {Meteor} from 'meteor/meteor';
import {Timesheets} from './collection';

Meteor.publish('timesheets.listByUserId', function (userId) {
console.log('-----000--',userId);
  return Timesheets.find({"user._id": userId});
});
