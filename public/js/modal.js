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

    medconnect.controller('prescriptions', function ($http, $scope, $location, $filter, $uibModalInstance, item){

      $http({
        method: 'POST',
        url: '/data/getStatic',
        data: {
          type : 'medications'
        }
      }).success(function (data) {
        $scope.medications = data;

      }).error(function (err) {
        console.log("error")
      })

      $scope.doctorName = item.doctorName;
      // $scope.visitID = item.visitID;

      $scope.update = function () {
        var fields = {
          // visitID : $scope.visitID,
          dosage : $scope.dosage,
          startDate : $scope.startDate,
          endDate : $scope.endDate,
          notes : $scope.notes,
          doctorName : $scope.doctorName,
          medicationID : $scope.name
        }

        $http({
          method: 'POST',
          url: '/patient/addPrescription',
          data: fields
        }).success(function (data) {
          console.log(data)

        }).error(function (err) {
          console.log("error")
        })

        fields.name = $scope.med.name;
        $uibModalInstance.close(fields);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

  })

  medconnect.controller('viewPrescriptions', function ($http, $scope, $location, $filter, $uibModalInstance, item){

    var item = item[0];
    var name = ['name', item.name];
    var dosage = ['dosage', item.dosage];
    var startDate = ['startDate', item.startDate];
    var endDate = ['endDate', item.endDate];
    var notes = ['notes', item.notes];

    $scope.arr = [name, dosage, startDate, endDate, notes];

    item[1]; // index
    $scope.medications = item.medications;
    $scope.doctorName = item.doctorName;
    // $scope.doctorID = item.doctorID;
    // $scope.visitID = item.visitID;

    $scope.update = function () {

      var fields = {
        // visitID : $scope.visitID,
        dosage : $scope.dosage,
        startDate : $scope.startDate,
        endDate : $scope.endDate,
        notes : $scope.notes,
        doctorName : $scope.doctorName
        // doctorID : $scope.doctorID,
        // medicationID : $scope.med._id
      }

      $http({
        method: 'POST',
        url: '/patient/addPrescription',
        data: fields
      }).success(function (data) {
        console.log(data)

      }).error(function (err) {
        console.log("error")
      })

      fields.name = $scope.med.name;
      $uibModalInstance.close(fields);
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
