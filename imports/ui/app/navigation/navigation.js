import angular from 'angular';
import {Meteor} from 'meteor/meteor';

import './navigation.css';

import templateUrl from './navigation.html';

class NavigationController {
	constructor($scope, $reactive, $state) {
		$reactive(this).attach($scope);

		this.$state = $state;
    this.user = Meteor.user();
	}

	logout() {
		Meteor.logout(() => {
			this.$state.go('login.login');
		});
	}
}

const name = 'app.navigation';

angular
  .module(name, [])
  .component('navigation', {
    templateUrl,
    controllerAs: 'nav',
    controller: ['$scope', '$reactive', '$state', NavigationController]
  });

export default name;
