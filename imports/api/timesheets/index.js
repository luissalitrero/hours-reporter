import {Meteor} from 'meteor/meteor';

if (Meteor.isServer) {
  import './publish';
  import './methods';
}

export * from './collection';
