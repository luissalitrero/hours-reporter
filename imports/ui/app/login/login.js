import angular from 'angular';
import {Meteor} from 'meteor/meteor';

import loginTemplate from './login.html';

class Login {
	constructor($scope, $reactive, $state, $auth) {
    'ngInject';

		$reactive(this).attach($scope);

		this.loading = false;
		this.$state = $state;

		$auth
      .awaitUser()
      .then((user) => {
        if (user) { this.$state.go('app.dashboard'); }
      })
      .catch((error) => {
        console.log('-----Error--',error);
      });
	}
}

class LoginController extends Login {
	login() {
		Meteor
      .loginWithPassword(this.username, this.password, err => {
        if (err) { return alert(err.message); }

        this.$state.go('app.dashboard');
      });
	}
}

const name = 'login';

export default name;

angular
  .module(name, [])
  .config(config);

function config($stateProvider) {
	$stateProvider
    .state('login', {
      abstract: true,
      url: '/login',
      template: '<div ui-view></div>'
    })
    .state('login.login', {
      url: '',
      templateUrl: loginTemplate,
      controller: ['$scope', '$reactive', '$state', '$auth', LoginController],
      controllerAs: 'l'
    });
}

config.$inject = ['$stateProvider'];
