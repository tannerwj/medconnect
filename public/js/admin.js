(function(){

  var medconnect = angular.module("mcAdmin", []);

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

  medconnect.controller('CreateAdmin', ['$http', function($http){

  }])

}());
