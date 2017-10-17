import {Mongo} from 'meteor/mongo';

export const Timesheets = new Mongo.Collection('timesheets');

//Timesheets.allow({
//  insert(timesheet) {
//    return userId ? true : false;
//  }
//});
