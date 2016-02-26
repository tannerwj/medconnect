var medconnect = angular.module('medconnect', ['ngRoute', 'ngMessages']);

medconnect.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({enabled:true, requireBase : false});
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'Login'
      })
      .when('/register-patient', {
        templateUrl: 'views/patient/register.html',
        controller: 'PRController'
      })
      .when('/register-doctor', {
        templateUrl: 'views/doctor/register.html',
        controller: 'DRController'
      })
  }]);

medconnect.controller('Login', ['$http', function($http){

  var vm = this;

  vm.postForm = function(){
    if(vm.username && vm.password){
      $http({
        method:'POST',
        url:'/login',
        data: {
          'email' : vm.email,
          'password' : vm.password
        }
      }).success(function(data){
        console.log(data);
      }).error(function(err){
        console.log('Server error: ' + err);
      })
  }

}}]);

medconnect.controller('PRController', ['$http', function($http){

  var vm = this;
  vm.error = true;

  vm.register = function(){
    if(vm.firstName && vm.lastName && vm.password && vm.email){
      $http({
        method:'POST',
        url:'/patient-register',
        data: {
          'email' : vm.email,
          'first' : vm.firstName,
          'last' : vm.lastName,
          'pass': vm.password
        }
      }).success(function(data){
        console.log(data);
      }).error(function(err){
        console.log('Server error: ' + err);
      })
  }else{
    vm.error = false;
  }

}}]);

medconnect.controller('DRController', ['$http', function($http){

  var vm = this;
  vm.error = true;

  vm.register = function(){
    if(vm.firstName && vm.lastName && vm.password && vm.email){
      $http({
        method:'POST',
        url:'/doctor-register',
        data: {
          'email' : vm.email,
          'first' : vm.firstName,
          'last' : vm.lastName,
          'pass': vm.password
        }
      }).success(function(data){
        console.log(data);
      }).error(function(err){
        console.log('Server error: ' + err);
      })
  }else{
    vm.error = false;
  }

}}]);
