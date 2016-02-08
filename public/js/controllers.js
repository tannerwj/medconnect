var medconnect = angular.module('medconnect', []);

medconnect.controller('login', ['$http','$scope', function($http, $scope){

  this.postForm = function(){
      $http({
        method:'POST',
        url:'../../controllers/routes.js',
        data: {
          'username':this.username,
          'password':this.password
        },
        // headers:{'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function(data, status, headers, config){
        console.log(data);
        if(valid()){
          //redirect
        }else{
          $scope.errMessage = "Login Not Correct";
        }
      }).error(function(data,status,headers,config){
        console.log('Unable to submit form');
      })
  }
}]);
