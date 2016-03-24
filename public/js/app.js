var medconnect = angular.module('medconnect', ['mcPatient', 'mcDoctor', 'mcAdmin','mcModal', 'mcService', 'ngRoute', 'ngMessages', 'ui.bootstrap']);

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
        controller:'nav'
      })
      .when('/register-doctor', {
        templateUrl: '/views/doctor/register.html'
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
      .when('/register-patient', {
        templateUrl: '/views/patient/register.html'
      })
      .when('/doctor/changePassword', {
        templateUrl: '/views/doctor/changePassword.html',
        resolve:{
          isDoctor: isDoctor
        },
        controller: 'ChangePassword'
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
      .when('/patient/search', {
        templateUrl: '/views/patient/search.html',
        resolve:{
          isPatient: isPatient
        }
      })
      .when('/patient/seeDoctor', {
        templateUrl: '/views/patient/seeDoctor.html',
        resolve:{
          isPatient: isPatient
        }
      })
      .when('/patient/records', {
        templateUrl: '/views/patient/recordsmenu.html',
				resolve:{
					isPatient: isPatient
				}
      })
      .when('/patient/changePassword', {
        templateUrl: '/views/patient/changePassword.html',
				resolve:{
					isPatient: isPatient
				},
        controller: 'ChangePassword'
      })
      .when('/patient/records/feedback', {
        templateUrl: '/views/patient/feedback.html',
				resolve:{
					isPatient: isPatient
				}
      })
      .when('/patient/records/prescription', {
        templateUrl: '/views/patient/prescription.html',
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
      .when('/admin/manageAdmins', {
        templateUrl: '/views/admin/create.html',
				resolve:{ isAdmin: isAdmin },
        controller: 'CreateAdmin'
      })
      .when('/admin/changePassword', {
        templateUrl: '/views/admin/changePassword.html',
        resolve:{ isAdmin: isAdmin },
        controller: 'ChangePassword'
      })

  }]);

medconnect.controller('nav', ['$http', '$location', '$scope', '$rootScope', '$window', function($http, $location, $scope, $rootScope, $window){

  $rootScope.$on("$routeChangeStart", function(){
    var p = $location.path()
    $scope.home = p === '/' || p === '/admin' || p === '/patient' || p === '/doctor'
  })

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

  vm.failure = false

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
        if(userType === '0'){
          $location.url('/doctor')
        }else if(userType === '1'){
          $location.url('/patient')
        }else if(userType === '2'){
          $location.url('/admin')
        }else if(userType === 'unverified'){
          vm.failure = 'Unverified'
        }else if(userType === 'invalid'){
          vm.failure = 'Incorrect credentials'
        }
      }).error(function(err){
        console.log('Server error: ' + err);
      })
  }
}}]);

medconnect.controller('VerifyDoctor', ['$http', '$scope', function($http, $scope){
  $scope.success = false
  $scope.failure = false
  $scope.verified = []
  $scope.unverified = []
  $scope.denied = []

  $scope.init = function(){
    getData()
  }

  $scope.verify = function(user, arr){
    $http.post('/admin/verifyDoctor', {
      user: user
    })
    $scope.success = 'Successfully verified ' + user.firstName + ' ' + user.lastName
    $scope.failure = false
    $scope.verified.push(user)
    for(var i=0; i<arr.length; i++){
      if(arr[i].email === user.email){
        arr.splice(i,1)
        return
      }
    }
  }

  $scope.deny = function(user, arr){
    $http.post('/admin/denyDoctor', {
      user: user
    })
    $scope.success = user.firstName + ' ' + user.lastName + ' has been denied'
    $scope.failure = false
    $scope.denied.push(user)
    for(var i=0; i<arr.length; i++){
      if(arr[i].email === user.email){
        arr.splice(i,1)
        return
      }
    }
  }

  $scope.unverify = function(user, arr){
    $http.post('/admin/unverifyDoctor', {
      user: user
    })
    $scope.success = user.firstName + ' ' + user.lastName + ' has been unverified'
    $scope.failure = false
    $scope.unverified.push(user)
    for(var i=0; i<arr.length; i++){
        if(arr[i].email === user.email){
          arr.splice(i,1)
          return
        }
      }
  }

  var getData = function (){
    $http.post('/admin/viewDoctors', {}).success(function (data){
      $scope.verified = data.verified
      $scope.unverified = data.unverified
      $scope.denied = data.denied
    })
  }

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
		}).success(function(id){
      if(id){
        $scope.success = $scope.name + ' successfully added'
        $scope.failure = false
        $scope.actives.push({_id:id, name:$scope.name})
        $scope.name = ''
      }else{
        $scope.failure = $scope.name + ' already exists'
        $scope.success = false
        for(var i=0;i<$scope.actives.length;i++){
          if($scope.actives[i].name === $scope.name){
            $scope.actives.splice(i, 1)
            break
          }
        }
        $scope.name = ''
      }
    })
  }

  $scope.deactivate = function (d){
    $http.post('/admin/deactivate', {
      type: type,
      id: d._id
    })
    $scope.success = d.name + ' successfully deactivated'
    $scope.failure = false
    $scope.inactives.push({_id:d._id, name:d.name})
    for(var i=0;i<$scope.actives.length;i++){
      if($scope.actives[i].name === d.name){
        $scope.actives.splice(i, 1)
        break
      }
    }
  }

  $scope.edit = function (d){
    d.isEdit = true
    d.originalName = d.name
  }

  $scope.saveChanges = function(d){
    $http.post('/admin/edit', {
      type: type,
      name: d.name,
      id: d._id
    }).success(function(){
      $scope.success = d.name + ' successfully added'
      $scope.failure = false
      d.isEdit = false
    }).error(function (){
      $scope.failure = d.name + ' already exists'
      $scope.success = false
      d.name = d.originalName
      d.isEdit = false
    })
  }

  $scope.activate = function (d){
    $http.post('/admin/activate', {
      type: type,
      id: d._id
    })
    $scope.success = d.name + ' successfully activated'
    $scope.failure = false
    $scope.actives.push({_id:d._id, name:d.name})
    for(var i=0;i<$scope.inactives.length;i++){
      if($scope.inactives[i].name === d.name){
        $scope.inactives.splice(i, 1)
        break
      }
    }
  }

  $scope.delete = function (d){
    $http.post('/admin/delete', {
      type: type,
      id: d._id
    }).success(function(result){
      if(result && result !== 'in use'){
        $scope.success = d.name + ' successfully deleted'
        $scope.failure = false
        for(var i=0;i<$scope.inactives.length;i++){
          if($scope.inactives[i].name === d.name){
            $scope.inactives.splice(i, 1)
            break
          }
        }
      }else if(result){
        $scope.failure = d.name + ' is in use and cannot be deleted'
        $scope.success = false
      }else{
        $scope.failure = d.name + ' deletion unsuccessful'
        $scope.success = false
      }
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

  $scope.add = function() {
    if($scope.newAdmin.password === $scope.newAdmin.passwordConfirm){
      $http.post('/admin/createAdmin', {
        data: $scope.newAdmin
      }).success(function(data) {
        $scope.success = $scope.newAdmin.email + ' successfully added'
        $scope.failure = false
        $scope.currentAdmins.push($scope.newAdmin)
        $scope.newAdmin = {}
      }).error(function() {
        $scope.failure = $scope.newAdmin.email + ' already exists'
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
      email: d.email
    })
    $scope.success = d.email + ' successfully deleted'
    $scope.failure = false
    for(var i=0;i<$scope.currentAdmins.length;i++){
      if($scope.currentAdmins[i].email === d.email){
        $scope.currentAdmins.splice(i,1)
        return
      }
    }
  }

  var getData = function (){
    $http.post('/admin/viewAdmins', {
      type: type
    }).success(function (data){
      $scope.currentAdmins = data.currentAdmins
    })
  }
}])

medconnect.controller('ChangePassword', ['$http', '$scope', function($http, $scope){
  $scope.success = false
  $scope.failure = false
  $scope.currentAdmin = {}
  $scope.currentDoctor = {}
  $scope.currentPatient = {}
  $scope.type = "";

  $scope.init = function (type){
    $scope.type = type;
    getData(type)
  }

  $scope.changePassword = function(){
    console.log('attempting to change password')
    if($scope.type == "admin"){
      if($scope.admin.password === $scope.admin.passwordConfirm){
        $http.post('/admin/changePassword', {
          newPass: $scope.admin.password,
          oldPass: $scope.admin.currentPassword,
          currentPass: $scope.currentAdmin.password
        }).success(function (data){
          $scope.success = 'Password changed successfully'
          $scope.failure = false
          $scope.admin.currentPassword = ''
          $scope.admin.password = ''
          $scope.admin.passwordConfirm = ''
        }).error(function(err){
          $scope.success = false
          $scope.failure = 'Current password is incorrect'
        })
      }else{
        $scope.success = false
        $scope.failure = 'Passwords must match'
        $scope.admin.password = ''
        $scope.admin.passwordConfirm = ''
      }
    }
    else if($scope.type == "doctor"){
      if($scope.doctor.password === $scope.doctor.passwordConfirm){
        $http.post('/doctor/changePassword', {
          newPass: $scope.doctor.password,
          oldPass: $scope.doctor.currentPassword,
          currentPass: $scope.doctor.password
        }).success(function (data){
          $scope.success = 'Password changed successfully'
          $scope.failure = false
          $scope.doctor.currentPassword = ''
          $scope.doctor.password = ''
          $scope.doctor.passwordConfirm = ''
        }).error(function(err){
          $scope.success = false
          $scope.failure = 'Current password is incorrect'
        })
      }else{
        $scope.success = false
        $scope.failure = 'Passwords must match'
        $scope.doctor.password = ''
        $scope.doctor.passwordConfirm = ''
      }
    }
    else if($scope.type == "patient"){
      if($scope.patient.password === $scope.patient.passwordConfirm){
        $http.post('/patient/changePassword', {
          newPass: $scope.patient.password,
          oldPass: $scope.patient.currentPassword,
          currentPass: $scope.patient.password
        }).success(function (data){
          $scope.success = 'Password changed successfully'
          $scope.failure = false
          $scope.patient.currentPassword = ''
          $scope.patient.password = ''
          $scope.patient.passwordConfirm = ''
        }).error(function(err){
          $scope.success = false
          $scope.failure = 'Current password is incorrect'
        })
      }else{
        $scope.success = false
        $scope.failure = 'Passwords must match'
        $scope.patient.password = ''
        $scope.patient.passwordConfirm = ''
      }
    }
  }

  var getData = function (type){

    if(type === "admin"){
      $http.post('/admin/getAdmin', {}).success(function (data){
        $scope.currentAdmin = data.currentAdmin
      })
    }
    else if(type === "doctor"){
      $http.post('/doctor/getDoctor', {}).success(function (data){
        $scope.currentDoctor = data.currentDoctor
      })
    }
    else if(type === "patient"){
      $http.post('/patient/getPatient', {}).success(function (data){
        $scope.currentPatient = data.currentPatient
      })
    }



  }
}])
