var medconnect = angular.module('medconnect', ['ngRoute']);

medconnect.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({enabled:true, requireBase : false});
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'login'
      })
      .when('/register-patient', {
        templateUrl: 'views/patient/register.html'
        //controller: 'patient'
      })
      .when('/register-doctor', {
        templateUrl: 'views/doctor/register.html'
        //controller: 'patient'
      })
  }]);

medconnect.controller('login', ['$http','$scope', function($http, $scope){

  $scope.postForm = function(){

    if($scope.username && $scope.password){
      var username = $scope.username;
      var password = $scope.password;

      $http({
        method:'POST',
        url:'/login',
        data: {
          'username': username,
          'password': password
        }
        // headers:{'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function(data, status, headers, config){
        console.log(data);
      }).error(function(data,status,headers,config){
        console.log('Unable to submit form');
      })
    }
    else{
      $scope.errMessage = "Missing one or more fields";
    }
  }
}]);

medconnect.controller('PRController', ['$http','$scope', function($http, $scope){

}]);

medconnect.controller('DRController', ['$http','$scope', function($http, $scope){

}]);
