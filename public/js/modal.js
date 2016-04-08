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

  medconnect.controller('vitals', function ($http, $scope, $location, $filter, $uibModalInstance, item){

    $scope.visitID = item.visitID;

    $scope.update = function () {

      var fields = {
        vitalsDate : $scope.vitalsDate,
        height : $scope.height,
        weight : $scope.weight,
        BMI : $scope.BMI,
        temperature : $scope.temperature,
        pulse : $scope.pulse,
        respiratoryRate : $scope.respiratoryRate,
        bloodPressure : $scope.bloodPressure,
        bloodOxygenSat : $scope.bloodOxygenSat
      }

      $http({
        method: 'POST',
        url: '/patient/addVitals',
        data: fields
      }).success(function (data) {
        console.log(data)

      }).error(function (err) {
        console.log("error")
      })

      $uibModalInstance.close(fields);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

})

    medconnect.controller('prescriptions', function ($http, $scope, $location, $filter, $uibModalInstance, item){

      $scope.visitID = item.visitID;

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

      $scope.update = function () {

        var fields = {
          visitID : $scope.visitID,
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

  medconnect.controller('Note', function ($http, $scope, $location, $filter, $uibModalInstance, item){

    $scope.visitID = item;
    var fields = {
      visitID : item,
      note : $scope.note
    }

    $scope.update = function () {

      $http({
        method: 'POST',
        url: '/patient/addNote',
        data: fields
      }).success(function (data) {
        console.log(data)

      }).error(function (err) {
        console.log("error")
      })

      $uibModalInstance.close(fields);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

})

medconnect.controller('upload', function ($http, Upload, $window, $scope, $uibModalInstance, item){

  $scope.visitID = item;

  $http({
    method: 'POST',
    url: '/data/getStatic',
    data: {
      type : 'datatypes'
    }
  }).success(function (data) {
    $scope.datatypes = data;
  }).error(function (err) {
    console.log("error")
  })


  $scope.submit = function(){
    if ($scope.upload_form.file.$valid && $scope.file) {
       $scope.upload($scope.file)
    }
  }

  $scope.upload = function (file){

    $scope.type;
    $scope.name; //title

    $scope.fields = {
      file: file,
      dataTypeID: 10,
      dataName: 'work'
    }

    Upload.upload({
      url:'/patient/addFile',
      data: $scope.fields
    }).then(function (resp) {
        if(resp.data.error_code === 0){
            console.log('Success ' + resp.config.data.file.name + ' uploaded')
            // $uibModalInstance.close(fields);
        } else{
          console.log('an error occured')
        }
    }, function (resp) {
        console.log('Error status: ' + resp.status)
    })

  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

})

medconnect.controller('viewVitals', function ($http, $scope, $location, $filter, $uibModalInstance, item){

  var item = item[0];
  $scope.vitalsDate = item.vitalsDate;
  $scope.height = item.height;
  $scope.weight = item.weight;
  $scope.BMI = item.BMI;
  $scope.temperature = item.temperature;
  $scope.pulse = item.pulse;
  $scope.respiratoryRate = item.respiratoryRate;
  $scope.bloodPressure = item.bloodPressure;
  $scope.bloodOxygenSat = item.bloodOxygenSat;

  var arrIndex = item[1]; // index
  $scope.visitID = item[2];

  // var fields = {
  //   visitID : $scope.visitID,
  //   vitalsDate : $scope.vitalsDate,
  //   height : $scope.height,
  //   weight : $scope.weight,
  //   BMI : $scope.BMI,
  //   temperature : $scope.temperature,
  //   pulse : $scope.pulse,
  //   respiratoryRate : $scope.respiratoryRate,
  //   bloodPressure : $scope.bloodPressure,
  //   bloodOxygenSat : $scope.bloodOxygenSat
  // }

  $scope.delete = function () {

    var fields = { // to delete
      visitID : $scope.visitID
    }

    $http({
      method: 'POST',
      url: '/patient/deleteVitals',
      data: fields
    }).success(function (data) {
      console.log(data)

    }).error(function (err) {
      console.log("error")
    })

    $uibModalInstance.close(arrIndex);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

})

  medconnect.controller('viewPrescriptions', function ($http, $scope, $location, $filter, $uibModalInstance, item){

    var item = item[0];
    var name = ['Prescription Name', item.name];
    var dosage = ['Dosage', item.dosage];
    var startDate = ['Start Date', item.startDate];
    var endDate = ['Stop Date', item.stopDate];
    var notes = ['Notes', item.notes];
    var arrIndex = item[1]; // index

    $scope.arr = [name, dosage, startDate, endDate, notes];

    $scope.medications = item.medications; // To populate dropdown
    $scope.visitID = item.visitID;

    $scope.delete = function () {
      $http.post('/patient/removePrescription', {
        medicationID: item.medicationID,
        visitID: item.visitID
      }).error(function (err) {
        console.log("error")
      })

      $uibModalInstance.close(arrIndex);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

})

medconnect.controller('viewNote', function ($http, $scope, $location, $filter, $uibModalInstance, item){

  var item = item[0];
  var note = ['Note', item.note];
  var arrIndex = item[1];

  $scope.arr = [note];
  $scope.visitID = item.visitID;

  //noteid?
  $scope.delete = function () {

    var fields = {
      visitID : $scope.visitID,
      note : note
      // medicationID : $scope.med._id
    }

    $http({
      method: 'POST',
      url: '/patient/deleteNote',
      data: fields
    }).success(function (data) {
      console.log(data)

    }).error(function (err) {
      console.log("error")
    })

    $uibModalInstance.close(arrIndex);
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
