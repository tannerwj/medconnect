var template = angular.module('template', ['ngRoute', 'medconnect']);

template.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'about.html',
        controller: 'register'
      })
      // otherwise({
      //   redirectTo: '/phones'
      // });
  }]);
