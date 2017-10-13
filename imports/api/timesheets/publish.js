import {Meteor} from 'meteor/meteor';
import Timesheet from './collection';

Meteor.publish('timesheets', () => {
  return Timesheets.find({});
});
