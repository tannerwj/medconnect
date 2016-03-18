(function(){
  var medconnect = angular.module("mcModal", []);

  medconnect.controller('ModalInstanceCtrl', function ($scope, $location, $uibModalInstance, item) {

    $scope.item = item;
    if($scope.item[0] === "C"){ // registration pages
      $scope.ok = function () {
        $uibModalInstance.close($location.url('/'));
      };
    }else if($scope.item[0] === "A"){ // registration pages
      $scope.ok = function () {
        $uibModalInstance.close($location.url('/patient'));
      };
    }
    else if($scope.item[0] === "F"){ // registration pages
      $scope.ok = function () {
        $uibModalInstance.close($location.url('/doctor'));
      };
    }
    else{
      $scope.ok = function () {
        $uibModalInstance.close();
      };
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });

}());
