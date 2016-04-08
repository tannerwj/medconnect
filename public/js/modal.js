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

    var visitID = item;

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
      var st = $scope.startDate
      var start = st.getFullYear() + '-' + (st.getMonth() + 1) + '-' + st.getDate()

      var et = $scope.endDate
      var end = et.getFullYear() + '-' + (et.getMonth() + 1) + '-' + et.getDate()

      var fields = {
        visitID : visitID,
        dosage : $scope.dosage,
        startDate : start,
        endDate : end,
        notes : $scope.notes || '',
        doctorName : '',
        medicationID : $scope.medID
      }

      $http({
        method: 'POST',
        url: '/patient/addPrescription',
        data: fields
      }).success(function () {
      }).error(function (err) {
        console.log("error")
      })

      for(var i = 0, len = $scope.medications.length; i < len; i++){
        if($scope.medications[i]._id == $scope.medID){
          fields.name = $scope.medications[i].name
          break
        }
      }
      $uibModalInstance.close(fields);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  })

  medconnect.controller('Note', function ($http, $scope, $location, $filter, $uibModalInstance, item){

    $scope.update = function () {
      var fields = {
        visitID : item,
        note : $scope.note + '',
        noteDate: new Date()
      }

      $http({
        method: 'POST',
        url: '/patient/addNote',
        data: fields
      }).success(function (data) {
      }).error(function (err) {
        console.log("error")
      })
      console.log('before', fields)
      $uibModalInstance.close(fields);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })

  medconnect.controller('Vitals', function ($http, $scope, $location, $filter, $uibModalInstance, item){

    $scope.add = function () {
      var fields = {
        visitID : null,
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

    var visitID = item;

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
      $scope.fields = {
        file: file,
        dataTypeID: $scope.type,
        dataName: $scope.name,
        visitID: visitID
      }

      Upload.upload({
        url:'/patient/addFile',
        data: $scope.fields
      }).then(function (data) {
          $uibModalInstance.close(data.data[0])
      }, function (resp) {
          console.log('Error status: ' + resp.status)
      })

    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  })

  medconnect.controller('viewVitals', function ($http, $scope, $location, $filter, $uibModalInstance, item){
    $scope.id = item.vitalID
    $scope.vitalsDate = new Date(item.vitalsDate)
    $scope.height = Number(item.height)
    $scope.weight = Number(item.weight)
    $scope.BMI = Number(item.BMI)
    $scope.temperature = Number(item.temperature)
    $scope.pulse = Number(item.pulse)
    $scope.respiratoryRate = Number(item.respiratoryRate)
    $scope.bloodPressure = item.bloodPressure
    $scope.bloodOxygenSat = item.bloodOxygenSat

    $scope.add = function () {

      var fields = {
        vitalID: -1,
        visitID : item.visitID,
        vitalsDate : $scope.vitalsDate ,
        height : $scope.height ? $scope.height : '',
        weight : $scope.weight ? $scope.weight : '',
        BMI : $scope.BMI ? $scope.BMI : '',
        temperature : $scope.temperature ? $scope.temperature : '',
        pulse : $scope.pulse ? $scope.pulse : '',
        respiratoryRate : $scope.respiratoryRate ? $scope.respiratoryRate : '',
        bloodPressure : $scope.bloodPressure ? $scope.bloodPressure : '',
        bloodOxygenSat : $scope.bloodOxygenSat ? $scope.bloodOxygenSat : '',
        name: 'view vitals'
      }

      $http({
        method: 'POST',
        url: '/patient/addVitals',
        data: fields
      }).error(function (err) {
        console.log("error")
      })

      $uibModalInstance.close(fields);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  })

  medconnect.controller('viewPrescriptions', function ($http, $scope, $location, $filter, $uibModalInstance, item){
    var st = new Date(item.startDate)
    var start = st.getFullYear() + '-' + (st.getMonth() + 1) + '-' + st.getDate()

    var et = new Date(item.stopDate)
    var end = et.getFullYear() + '-' + (et.getMonth() + 1) + '-' + et.getDate()

    var item = item[0];
    $scope.name = item.name

    var name = ['Prescription Name', item.name];
    var dosage = ['Dosage', item.dosage];
    var startDate = ['Start Date', item.startDate];
    var endDate = ['End Date', item.stopDate];
    var notes = ['Notes', item.notes];

    $scope.arr = [dosage, startDate, endDate, notes];

    $scope.medications = item.medications; // To populate dropdown
    $scope.visitID = item.visitID;

    $scope.delete = function () {

      var fields = {
        visitID : $scope.visitID,
        medicationID : item.medicationID
      }

      $http({
        method: 'POST',
        url: '/patient/removePrescription',
        data: fields
      }).success(function (data) {
      }).error(function (err) {
        console.log("error")
      })

      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })

  medconnect.controller('viewNote', function ($http, $scope, $location, $filter, $uibModalInstance, item){

    $scope.note = item

    $scope.delete = function () {
      console.log('id', $scope.note.noteID)
      $http({
        method: 'POST',
        url: '/patient/removeNote',
        data: {
          noteID: $scope.note.noteID
        }
      }).success(function (data) {
        console.log(data)

      }).error(function (err) {
        console.log("error")
      })

      $uibModalInstance.close(item.nodeID);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  })

}());
