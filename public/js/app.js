var medconnect = angular.module('medconnect', ['mcPatient', 'mcDoctor', 'mcAdmin','ngRoute', 'ngMessages', 'ui.bootstrap']);

medconnect.run(['$window', '$rootScope',
function ($window ,  $rootScope) {
  $rootScope.goBack = function(){
    $window.history.back();
  }
}]);

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

}}]);

medconnect.controller('PRController', ['$http', '$location', function($http, $location){

  var vm = this;
  vm.error = true;

  var receiveInputs = function(){
    if(vm.email && vm.firstName && vm.lastName && vm.gender && vm.address && vm.phoneNumber && vm.password && vm.passwordConfirm){
      if(vm.password === vm.passwordConfirm){
        return true;
      }
    }
    return false;
  }

  vm.register = function(){
    if(receiveInputs()){
      $http({
        method:'POST',
        url:'/patient/register',
        data: {
          'email' : vm.email,
          'first' : vm.firstName,
          'last' : vm.lastName,
          'gender' : vm.gender,
          'address' : vm.address,
          'phone' : vm.phoneNumber,
          'password': vm.password
        }
      }).success(function(data){
        console.log(data);
      }).error(function(err){
        console.log('Server error: ' + err);
      })
      $location.url('/')
  }else{
    vm.error = false;
  }

}}]);


medconnect.controller('DRController', ['$http', '$location', function($http, $location){

  var vm = this;
  vm.error = true;

  var receiveInputs = function(){
    if(vm.email && vm.firstName && vm.lastName && vm.address && vm.phoneNumber && vm.password && vm.passwordConfirm && vm.code){
      if(vm.password === vm.passwordConfirm){
        return true;
      }
    }
    return false;
  }

  vm.register = function(){
    if(receiveInputs()){
      $http({
        method:'POST',
        url:'/doctor/register',
        data: {
          'email' : vm.email,
          'first' : vm.firstName,
          'last' : vm.lastName,
          'address' : vm.address,
          'phone' : vm.phoneNumber,
          'password': vm.password,
          'code' : vm.code
        }
      }).success(function(data){
        console.log(data);
      }).error(function(err){
        console.log('Server error: ' + err);
      })
      $location.url('/')
  }else{
    vm.error = false;
  }

}}]);

medconnect.controller('VerifyDoctor', ['$http', function($http){

}])

medconnect.controller('AdminManage', ['$http', '$scope', function($http, $scope){
  $scope.success = false
  $scope.failure = false
  $scope.actives = []
  $scope.inactives = []

  var type

  $scope.init = function (t){
    type = t
    getData()
  }

  $scope.add = function (){
    $http.post('/admin/add', {
			type: type,
			data: $scope.name
		}).success(function (data){
      $scope.success = $scope.name + ' successfully added'
      $scope.failure = false
      $scope.name = ''
      getData()
		}).error(function (){
      $scope.failure = $scope.name + ' already exists'
      $scope.success = false
      $scope.name = ''
		})
  }

  $scope.deactivate = function (d){
    $http.post('/admin/deactivate', {
      type: type,
      id: d._id
    }).success(function (){
      $scope.success = d.name + ' successfully deactivated'
      $scope.failure = false
      getData()
		})
  }

  $scope.edit = function (d){
    alert(d.name)
  }

  $scope.activate = function (d){
    $http.post('/admin/activate', {
      type: type,
      id: d._id
    }).success(function (){
      $scope.success = d.name + ' successfully activated'
      $scope.failure = false
      getData()
		})
  }

  $scope.delete = function (d){
    $http.post('/admin/delete', {
      type: type,
      id: d._id
    }).success(function (){
      $scope.success = d.name + ' successfully deleted'
      $scope.failure = false
      getData()
		})
  }

  var getData = function (){
    $http.post('/admin/view', {
      type: type
    }).success(function (data){
      $scope.actives = data.actives
      $scope.inactives = data.inactives
		})
  }
}])

medconnect.controller('CreateAdmin', ['$http', '$scope', function($http, $scope){
  $scope.success = false
  $scope.failure = false
  $scope.currentAdmins = []

  $scope.init = function (){
    type = 'user'
    getData()
  } 

  var receiveInputs = function(){
    if($scope.newAdmin.password === $scope.newAdmin.passwordConfirm){
      return true
    }
    return false
  }

  $scope.add = function() {
    if(receiveInputs()){
      $http.post('/admin/createAdmin', {
        data: $scope.newAdmin
      }).success(function(data) {
        $scope.success = $scope.newAdmin.firstName + ' ' + $scope.newAdmin.lastName + ' successfully added'
        $scope.failure = false
        $scope.newAdmin = {}
        getData()
      }).error(function() {
        $scope.failure = $scope.newAdmin.firstName + ' ' + $scope.newAdmin.lastName + ' already exists'
        $scope.success = false
        $scope.newAdmin = {}
      })
    }else{
      $scope.failure = 'Passwords must match'
      $scope.success = false
    }
  }
  
  $scope.delete = function (d){
    $http.post('/admin/deleteAdmin', {
      id: d.userID
    }).success(function (){
      $scope.success = d.firstName + ' ' + d.lastName + ' successfully deleted'
      $scope.failure = false
      getData()
    })
  }

  var getData = function (){
    $http.post('/admin/viewAdmins', {
      type: type
    }).success(function (data){
      $scope.currentAdmins = data.currentAdmins
    })
  }
  
}])