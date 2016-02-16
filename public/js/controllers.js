var medconnect = angular.module('medconnect', []);

medconnect.controller('login', ['$http','$scope', function($http, $scope){

  $scope.postForm = function(){

    if($scope.username && $scope.password){
      var username = $scope.username;
      var password = $scope.password;

      $http({
        method:'POST',
        url:'../../controllers/routes.js',
        data: {
          'username': username,
          'password': password
        },
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
