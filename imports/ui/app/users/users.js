import angular from 'angular';
import {Meteor} from 'meteor/meteor';

import templateUrl from './users.html';

class UsersController {
	constructor($scope, $reactive, currentUser) {
		$reactive(this).attach($scope);

		this.options = {
			filter: '',
			page: 1
		}

		$scope.$watch(angular.bind(this, () => this.options.page), () => {
			this.search();
		});
	}

	search() {
		this.loading = true;

		this.call('users.search', this.options, (err, res) => {
			this.loading = false;

			if (err) { return alert(err.reason || err.message); }

			this.users = res.users;
			this.total = res.total;
		});
	}
}

const name = 'app.users';

angular
  .module(name, [])
  .config(config);

export default name;

function config($stateProvider) {
  $stateProvider
    .state('app.users', {
      abstract: true,
      url: '/users',
      template: '<div ui-view></div>'
    })
    .state('app.users.index', {
      url: '',
      templateUrl,
      controller: ['$scope', '$reactive', UsersController],
      controllerAs: 'uu',
      resolve: {
        currentUser: ($auth, $state, $q) => {
          let deferred = $q.defer();

          return $auth.awaitUser()
            .then((user) => {
              if (user.username !== 'superuser') { deferred.reject('FORBIDDEN_GO_DASHBOARD'); }
              else { deferred.resolve(); }

              return deferred.promise;
            })
            .catch((error) => {
              deferred.reject('FORBIDDEN_NO_USER');

              return deferred.promise;
            });
        }
      }
    })
}

config.$inject = ['$stateProvider'];
