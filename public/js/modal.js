(function(){
  var medconnect = angular.module("mcModal", []);

  medconnect.controller('ModalInstanceCtrl', function ($scope, $location, $filter, $uibModalInstance, item) {

    if(typeof(item) === 'string'){
      $scope.item = item;
      if($scope.item[0] === "C"){ // registration pages
        $scope.ok = function () {
          $uibModalInstance.close($location.url('/'));
        };
      }else if($scope.item[0] === "A" || $scope.item[0] === "Y" || $scope.item[0] === "S"){
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

    medconnect.controller('appointmentModal', function ($scope, $location, $filter, $uibModalInstance, item){

      $scope.item = item[0];
      $scope.delete = function () {
        $uibModalInstance.close(item);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };


      })

      medconnect.controller('imgModal', function ($scope, $location, $filter, $uibModalInstance, item){

         $scope.img = item[0];
        $scope.delete = function () {
          $uibModalInstance.close(item);
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };


        })

    }());
