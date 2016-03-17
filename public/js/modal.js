(function(){
  var medconnect = angular.module("mcModal", []);

  medconnect.controller('ModalInstanceCtrl', function ($scope, $location, $uibModalInstance, item) {

    $scope.item = item;
    if($scope.item[0] === "C"){
      $scope.ok = function () {
        $uibModalInstance.close($location.url('/'));
      };
    }else{
      $scope.ok = function () {
        $uibModalInstance.close();
      };
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });

}());
