import {Meteor} from 'meteor/meteor';

if (Meteor.isServer) {
  import './publish';
}

export * from './collection';
