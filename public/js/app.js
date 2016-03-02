var medconnect = angular.module('medconnect', ['ngRoute', 'ngMessages']);

medconnect.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {

    var isDoctor = function ($q, $http, $location){
      var deferred = $q.defer()
      $http.get('/loggedin').success(function (userType){
        if (userType === '0'){
          deferred.resolve()
        }else{
          deferred.reject()
          $location.url('/')
        }
      })
      return deferred.promise
    }

    var isPatient = function ($q, $http, $location){
      var deferred = $q.defer()
      $http.get('/loggedin').success(function (userType){
        if (userType === '1'){
          deferred.resolve()
        }else{
          deferred.reject()
          $location.url('/')
        }
      })
      return deferred.promise
    }

    var isAdmin = function ($q, $http, $location){
      var deferred = $q.defer()
      $http.get('/loggedin').success(function (userType){
        if (userType === '2'){
          deferred.resolve()
        }else{
          deferred.reject()
          $location.url('/')
        }
      })
      return deferred.promise
    }

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
      .when('/doctor', {
        templateUrl: 'views/doctor/index.html',
				resolve:{
					isDoctor: isDoctor
				}
      })
      .when('/patient', {
        templateUrl: 'views/patient/index.html',
				resolve:{
					isPatient: isPatient
				}
      })
      .when('/admin', {
        templateUrl: 'views/admin/index.html',
				resolve:{
					isAdmin: isAdmin
				}
      })
  }]);

medconnect.controller('Login', ['$http', '$location', function($http, $location){

  var vm = this;

  vm.postForm = function(){
    if(vm.email && vm.password){
      $http({
        method:'POST',
        url:'/login',
        data: {
          'email' : vm.email,
          'password' : vm.password
        }
      }).success(function(userType){
        console.log('userType', userType)
        if(userType === '0'){ //doctor
            $location.url('/doctor')
        }else if(userType === '1'){//patient
            $location.url('/patient')
        }else if(userType === '2'){//admin
            $location.url('/admin')
        }else if(userType === 'unverified'){
            console.log('user is unverified')
        }else if(userType === 'invalid'){
            console.log('invalid credentials')
        }
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
