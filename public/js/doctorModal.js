(function(){
  var medconnect = angular.module("docModal", []);

  medconnect.controller('DoctorPrescriptions', function ($http, $scope, $location, $filter, $uibModalInstance, item){

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
      var st = new Date($scope.startDate)
      var start = st.getFullYear() + '-' + (st.getMonth() + 1) + '-' + st.getDate()

      var et = new Date($scope.stopDate)
      var end = et.getFullYear() + '-' + (et.getMonth() + 1) + '-' + et.getDate()

      var fields = {
        visitID : visitID,
        dosage : $scope.dosage,
        startDate : start,
        stopDate : end,
        notes : $scope.notes || '',
        doctorName : '',
        medicationID : $scope.medication._id
      }

      $http({
        method: 'POST',
        url: '/doctor/addPrescription',
        data: fields
      }).success(function () {
      }).error(function (err) {
        console.log("error")
      })

      fields.name = $scope.medication.name
      $uibModalInstance.close(fields);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  })

  medconnect.controller('DoctorNote', function ($http, $scope, $location, $filter, $uibModalInstance, item){

    $scope.update = function () {
      var fields = {
        visitID : item,
        note : $scope.note + ''
      }

      $http({
        method: 'POST',
        url: '/doctor/addNote',
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

  medconnect.controller('DoctorUpload', function ($http, Upload, $window, $scope, $uibModalInstance, item){

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
        url:'/doctor/addFile',
        data: $scope.fields
      }).then(function (data) {
          $uibModalInstance.close(data.data)
      }, function (resp) {
          console.log('Error status: ' + resp.status)
      })

    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  })

  medconnect.controller('DoctorViewVitals', function ($http, $scope, $location, $filter, $uibModalInstance, item){

    $scope.vitalsDate = new Date(item.vitalsDate);
    $scope.height = Number(item.height);
    $scope.weight = Number(item.weight);
    $scope.BMI = Number(item.BMI);
    $scope.temperature = Number(item.temperature);
    $scope.pulse = Number(item.pulse);
    $scope.respiratoryRate = Number(item.respiratoryRate);
    $scope.bloodPressure = Number(item.bloodPressure);
    $scope.bloodOxygenSat = Number(item.bloodOxygenSat);

    $scope.update = function () {

      var fields = {
        visitID : item.visitID,
        vitalsDate : $scope.vitalsDate,
        height : $scope.height,
        weight : $scope.weight,
        BMI : $scope.BMI,
        temperature : $scope.temperature,
        pulse : $scope.pulse,
        respiratoryRate : $scope.respiratoryRate,
        bloodPressure : $scope.bloodPressure,
        bloodOxygenSat : $scope.bloodOxygenSat,
        name: 'view vitals'
      }

      $http({
        method: 'POST',
        url: '/doctor/editVitals',
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

  medconnect.controller('DoctorViewPrescriptions', function ($http, $scope, $location, $filter, $uibModalInstance, item){
    var st = new Date(item.startDate)
    var start = st.getFullYear() + '-' + (st.getMonth() + 1) + '-' + st.getDate()

    var et = new Date(item.stopDate)
    var end = et.getFullYear() + '-' + (et.getMonth() + 1) + '-' + et.getDate()

    var name = ['Prescription Name', item.name];
    var dosage = ['Dosage', item.dosage];
    var startDate = ['Start Date', start];
    var endDate = ['End Date', end];
    var notes = ['Notes', item.notes];

    $scope.arr = [name, dosage, startDate, endDate, notes];

    $scope.medications = item.medications; // To populate dropdown
    $scope.visitID = item.visitID;

    $scope.delete = function () {

      var fields = {
        visitID : $scope.visitID,
        medicationID : item.medicationID
      }

      $http({
        method: 'POST',
        url: '/doctor/removePrescription',
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

  medconnect.controller('DoctorViewNote', function ($http, $scope, $location, $filter, $uibModalInstance, item){

    $scope.note = item

    $scope.delete = function () {
      $http({
        method: 'POST',
        url: '/doctor/removeNote',
        data: {
          noteID: $scope.note.noteID
        }
      }).success(function (data) {

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
