var medconnect = angular.module('medconnect', []);

  medconnect.config(function($routeProvider){
    $routeProvider.
      when('/about', {template:'partials/about.html'}).
      when('/experiments', {template:'partials/experiments.html'}).
      otherwise({redirectTo:'/home', template:'partials/home.html'});
  });
