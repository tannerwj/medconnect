(function(){
  var medconnect = angular.module("mcModal", []);

  medconnect.controller('ModalInstanceCtrl', function ($scope, $location, $filter, $uibModalInstance, item) {

    if(typeof(item) === 'string'){
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
    }
    else{
      $scope.item = "Your data was successfully saved as below";
      $scope.schedule = item;
    }

      $scope.ok = function () {
        $uibModalInstance.close($location.url('/doctor'));
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });

}());
