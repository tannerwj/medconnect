var medconnect = angular.module('medconnect', ['mcPatient', 'mcDoctor', 'mcAdmin','ngRoute', 'ngMessages', 'ui.bootstrap']);

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
        templateUrl: '/views/login.html',
        controller: 'Login'
      })
      .when('/register-patient', {
        templateUrl: '/views/patient/register.html',
        controller: 'PRController'
      })
      .when('/register-doctor', {
        templateUrl: '/views/doctor/register.html',
        controller: 'DRController'
      })
      .when('/doctor', {
        templateUrl: '/views/doctor/index.html',
				resolve:{
					isDoctor: isDoctor
				}
      })
      .when('/doctor/edit', {
        templateUrl: '/views/doctor/profile.html',
				resolve:{
					isDoctor: isDoctor
				}
      })
      .when('/patient', {
        templateUrl: '/views/patient/index.html',
				resolve:{
					isPatient: isPatient
				}
      })
      .when('/patient/edit', {
        templateUrl: '/views/patient/profile.html',
				resolve:{
					isPatient: isPatient
				}
      })

    $routeProvider
      .when('/admin', {
        templateUrl: '/views/admin/index.html',
				resolve:{ isAdmin: isAdmin }
      })
      .when('/admin/verify', {
        templateUrl: '/views/admin/verify.html',
				resolve:{ isAdmin: isAdmin },
        controller: 'VerifyDoctor'
      })
      .when('/admin/medications', {
        templateUrl: '/views/admin/medications.html',
				resolve:{ isAdmin: isAdmin },
        controller: 'AdminManage'
      })
      .when('/admin/specialties', {
        templateUrl: '/views/admin/specialties.html',
				resolve:{ isAdmin: isAdmin },
        controller: 'AdminManage'
      })
      .when('/admin/allergies', {
        templateUrl: '/views/admin/allergies.html',
				resolve:{ isAdmin: isAdmin },
        controller: 'AdminManage'
      })
      .when('/admin/datatypes', {
        templateUrl: '/views/admin/datatypes.html',
				resolve:{ isAdmin: isAdmin },
        controller: 'AdminManage'
      })
      .when('/admin/create', {
        templateUrl: '/views/admin/create.html',
				resolve:{ isAdmin: isAdmin },
        controller: 'CreateAdmin'
      })

  }]);

medconnect.controller('nav', ['$http', '$location', '$scope', '$window', function($http, $location, $scope, $window){

		$scope.goBack = function(){
			$window.history.back();
		}

		$scope.goHome = function(){
		 $http.get('/loggedin').success(function (userType){
        if (userType === '0'){
          $location.url('/doctor');
        }else if(userType === '1'){
          $location.url('/patient');
        }else if(userType === '2'){
					$location.url('/admin');
				}else{
					$location.url('/');
				}
      })
	}
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
}
}]);
