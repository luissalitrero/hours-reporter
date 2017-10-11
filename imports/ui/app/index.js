import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import uiRouter from 'angular-ui-router';
import 'angular-ui-bootstrap';
import angularPassword from '../modules/angular-password.js';

import Filters from '../filters/filters';
import Login from './login/login';
import Navigation from './navigation/navigation';
import Dashboard from './dashboard/dashboard';
import Users from './users/users';

import templateUrl from './template.html';

const name = 'app';

export default name;

angular
  .module(name, [
    angularMeteor,
    angularMeteorAuth,
    uiRouter,
    'ui.bootstrap',
    angularPassword,
    Filters,
    Login,
    Navigation,
    Dashboard,
    Users
  ])
  .config(config)
  .run(run);

function config($locationProvider, $urlRouterProvider, $stateProvider) {
  'ngInject';

	$urlRouterProvider.otherwise('/');
	$locationProvider.html5Mode(true);

	$stateProvider.state('app', {
		abstract: true,
		url: '',
		templateUrl,
		resolve: {
			currentUser: ['$auth', $auth => {
				return $auth.awaitUser();
			}]
		}
	});
}

config.$inject = ['$locationProvider', '$urlRouterProvider', '$stateProvider'];

function run($rootScope, $state) {
  'ngInject';

	$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
		switch (error) {
			case 'AUTH_REQUIRED':
				return $state.go('login.login');
			case 'FORBIDDEN':
				return $state.go('error.403');
			case 'FORBIDDEN_GO_DASHBOARD':
				return $state.go('app.dashboard');
			case 'NOT_FOUND':
				return $state.go('error.404');
		}

		$state.go('error.500');
	});
}

run.$inject = ['$rootScope', '$state'];
