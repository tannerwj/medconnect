(function(){

var medconnect = angular.module("mcPatient", ['ngFileUpload']);

medconnect.controller('PatientHome', ['$http', '$scope', '$location', function($http, $scope, $location){
  $scope.logout = function(){
    $http.get('/logout')
    .success(function(){
      $location.url('/')
    })
  }
}])

medconnect.controller('PatientRegister', ['$http', '$location', '$uibModal', '$scope', function($http, $location, $uibModal, $scope){

  var vm = this;

  var receiveInputs = function(){
    if(vm.email && vm.firstName && vm.lastName && vm.gender && vm.address && vm.phoneNumber && vm.password && vm.passwordConfirm){
      if(vm.password === vm.passwordConfirm){
        return true;
      }
    }
    return false;
  }

  $scope.open = function (error, size) {

    if(error){
      $scope.item = "Missing/Incorrect fields, please try again.";
    }else{
      $scope.item = "Congratulations, you have successfully registered!";
    }
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '../views/modal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        item : function(){
          return $scope.item;
        }
      }
    });
  };

  vm.register = function(){
    if(receiveInputs()){
      $http({
        method:'POST',
        url:'/patient/register',
        data: {
          'email' : vm.email,
          'first' : vm.firstName,
          'last' : vm.lastName,
          'gender' : vm.gender,
          'address' : vm.address,
          'phone' : vm.phoneNumber,
          'password': vm.password
        }
      }).success(function(data){
        $scope.open(false);
        console.log(data);
      }).error(function(err){
        $scope.open(true);
        console.log('Server error: ' + err);
      })
  }else{
    $scope.open(true);
  }

}}]);

medconnect.controller('PatientProfile', ['$http', '$location', '$uibModal', '$scope', function($http, $location, $uibModal, $scope){

  var vm = this;
  vm.editMode = false;

	$http.get('/patient/info').success(function(info){
		console.log(info);
		vm.email = info.email;
		vm.firstName = info.firstName;
		vm.lastName = info.lastName;
		vm.bloodType = info.bloodType;
		vm.address = info.address;
		vm.phoneNumber = info.phone;
	}).catch(function(error){
		console.log("Error is : " + error);
	});

	vm.edit = function(){
    vm.editMode = !vm.editMode;
  }
  $scope.open = function (error, size) {

    if(error){
      $scope.item = "Missing/Incorrect fields, please try again.";
    }else{
      $scope.item = "Awesome, you have successfully Edited your profile!";
    }
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '../views/modal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        item : function(){
          return $scope.item;
        }
      }
    });
  };

  vm.save = function(){
      $http({
        method:'POST',
        url:'/patient/edit',
        data: {
          'firstName' : vm.firstName,
          'lastName' : vm.lastName,
          'bloodType' : vm.bloodType,
          'address' : vm.address,
          'phone' : vm.phoneNumber
        }
      }).success(function(data){
        $scope.open(false);
        console.log(data);
      }).error(function(err){
        $scope.open(true);
        console.log('Server error: ', err);
      })
  }

}])

medconnect.controller('PatientSearch', ['$http', '$location', function($http, $location){
  var vm = this;
  vm.doctors = [];
  vm.sortField = 'name'; // initialize sorting by lastName
  vm.reverse = true;

  vm.changeOrder = function(){
    vm.reverse = !vm.reverse;
  }

  $http.get('/patient/getDoctors').success(function (doctors){
    vm.doctors = doctors
  })

  vm.viewDoctor = function(doctor){
    var doctorID =  doctor.userID;
    $location.url("/patient/seeDoctor/" + doctorID);
  }

}]);

medconnect.controller('seeDoctor', ['$http', '$location', '$routeParams', function($http, $location, $routeParams){
  var vm = this;
  var doctorID = $routeParams.doctor_id

  $http.post('/patient/specific-doctor', {
    'id' : doctorID
  }).success(function(doctor){
    vm.name = doctor.first + ' ' + doctor.last
    vm.location = doctor.loc
    vm.specialties = doctor.specialties.map(function (s){ return s.name }).join(', ')
    vm.experience = doctor.exp
    vm.notes = doctor.notes
    vm.volunteerNotes = doctor.vol
  }).error(function(err){
    console.log('Server error: ' + err)
  })

  vm.next = function(){
    $location.url("/patient/seeDoctorSchedule/" + doctorID);
  }

}]);

medconnect.controller('seeDoctorSchedule', ['$http', '$location', '$uibModal', '$scope', '$routeParams', function($http, $location, $uibModal, $scope, $routeParams){

  var doctorID = $routeParams.doctor_id
  $scope.visit

  $http.post('/patient/specific-doctor', {
    'id' : doctorID
  }).success(function(doctor){
    $scope.lastName = doctor.last
    $scope.availability = JSON.parse(doctor.availability)
  }).error(function(err){
    console.log('Server error: ' + err)
  })

  $scope.submit = function(){
    var date = $scope.date.getDate();
    $scope.time.setDate(date);
    $http({
      method: 'POST',
      url: '/patient/requestAppointment',
      data: {
        doctorID : doctorID,
        reqDate : $scope.time
      }
    }).success(function (data) {
      $location.url('/patient/viewAppointments')
    }).error(function (err) {
      $scope.open(true)
    })
  }

  $scope.open = function (error, size) {

    if(error){
      $scope.item = "Missing/Incorrect fields, please try again.";
    }else{
      $scope.item = "You have successfully requested an appointment!";
    }
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/views/modal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        item : function(){
          return $scope.item;
        }
      }
    });
  };

  var d = new Date();
  d.setHours( 0 );
  d.setMinutes( 0 );
  $scope.time = d;
  $scope.date = new Date();

  // Datepicker
  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }


  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
}]);

medconnect.controller('appointments', ['$http', '$location', '$scope', function($http, $location, $scope){

  $scope.req = true;
  $scope.acc = true;
  $scope.rej = true;

  $http.get('/patient/getCurrentAppointments').success(function(info){
    if(info.requested.length > 0){
      $scope.requested = info.requested;
    }else{
      $scope.req = false;
    }
    if(info.accepted.length > 0){
      $scope.accepted = info.accepted;
    }else{
      $scope.acc = false;
    }
    if(info.rejected.length > 0){
      $scope.rejected = info.rejected;
    }else{
      $scope.rej = false;
    }
  }).catch(function(error){
    console.log("Error is : " + error);
  });

  $scope.appointmentDetails = function(id){
    var visitID = id;
    $location.url("/patient/appointmentDetails/" + visitID);
  }

}]);

medconnect.controller('patientRejectedAppts', ['$http', '$scope', '$routeParams', '$location', function($http, $scope, $routeParams, $location){
  $scope.editable = false
  $scope.visit = {}
  $scope.error = null
  $scope.init = function(){
    getData();
  }

  $scope.delete = function(){
    $http.post('/patient/deleteRejectedAppointment', {
      visitID: $scope.visit.visitID
    }).success(function(result){
      $location.url('/patient/viewAppointments')
    })
  }

  $scope.request = function(){
    $scope.editable = true
  }

  $scope.submit = function(){
    var date = $scope.newDate.getDate();
    $scope.newTime.setDate(date);
    $http.post('/patient/updateRejectedAppointment', {
      visitID: $scope.visit.visitID,
      visitDate: $scope.newTime 
    }).success(function(){
      $location.url('/patient/viewAppointments')
    })
  }

  var getData = function(){
    $http.post('/patient/getAppointmentDetail',{
      visitID: $routeParams.visitID
    }).success(function(result){
      $scope.visit = result.visit
    }).error(function(err){
      $scope.error = 'This appointment no longer exists.'
    })
  }

  // Datepicker
  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
}]);

medconnect.controller('appointmentDetails', ['$http', '$location', '$scope', '$uibModal', '$routeParams', function($http, $location, $scope, $uibModal, $routeParams){

  var visitID = $routeParams.visit_id;
  $scope.images = [];
  $scope.imgNames = [];

    $http({
      method: 'POST',
      url: '/patient/getAppointmentDetail',
      data: {
        visitID : visitID
      }
    }).success(function (data) {
      console.log(data)
      $scope.visitID = data.visitID;
      $scope.name = data.visit.firstName + " " + data.visit.lastName;
      $scope.date = data.visit.visitDate;
      $scope.diagnosis = data.visit.diagnosis;
      $scope.symptoms = data.visit.symptoms;
      // $scope.notes = data.notes;
      // $scope.prescriptions = data.prescriptions;
      // $scope.images = data.images;
      // $scope.vitals = data.vitals;

    }).error(function (err) {
      console.log("error")
    })

    $scope.vitals = [{name:"gg"}];

    $scope.addVital = function () {

      $scope.item = visitID;

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/views/addVitals.html',
        controller: 'vitals',
        resolve: {
             item : function(){
               return $scope.item;
             }
           }
      });
      modalInstance.result.then(function (fields) {
        $scope.vitals.push(fields);
      });
    }

    $scope.prescriptions = [{name:"gg"}];
    $scope.prescriptions.push({name:'hello'});

  $scope.addPre = function () {

    $scope.item = visitID;

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/views/addPrescription.html',
      controller: 'prescriptions',
      resolve: {
           item : function(){
             return $scope.item;
           }
         }
    });
    modalInstance.result.then(function (fields) {
      $scope.prescriptions.push(fields);
    });
  }

  $scope.notes = [
    {
      visitID : 222,
      note : 'asjdflkjwlef'
    }
  ];

  $scope.addNote = function () {

    $scope.item = visitID;

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/views/addNote.html',
      controller: 'Note',
      resolve: {
           item : function(){
             return $scope.item;
           }
         }
    });
    modalInstance.result.then(function (fields) {
      fields.note = fields.note.slice(0, 5); // display first 6 letters
      $scope.notes.push(fields);
    });
  }

  $scope.viewVital = function (arr, index) {

    $scope.item = [arr[index], index, visitID];

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/views/viewVitals.html',
      controller: 'viewVitals',
      resolve: {
        item : function(){
          return $scope.item;
        }
      }
    });
    modalInstance.result.then(function (index) {
      vitals.splice(index, 1);
    });
  }

  $scope.viewPre = function (arr, index) {

    $scope.item = [arr[index], index];

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/views/viewPrescriptions.html',
      controller: 'viewPrescriptions',
      resolve: {
        item : function(){
          return $scope.item;
        }
      }
    });
    modalInstance.result.then(function (index) {
      prescriptions.splice(index, 1);
    });
  }

  $scope.images = [{
    name:"asdfg"
  }]

  $scope.addImage = function () {

    $scope.item = visitID;

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/views/addUpload.html',
      controller: 'upload',
      resolve: {
           item : function(){
             return $scope.item;
           }
         }
    });
    modalInstance.result.then(function (fields) {
      fields.name = fields.name.slice(0, 5); // display first 6 letters
      $scope.images.push(fields);
    });
  }

  $scope.viewNote = function (arr, index) {
    $scope.item = [arr[index], index];

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/views/viewNote.html',
      controller: 'viewNote',
      resolve: {
        item : function(){
          return $scope.item;
        }
      }
    });
    modalInstance.result.then(function (index) {
      prescriptions.splice(index, 1);
    });
  }

  $scope.openImage = function (arr, index, error, size) {


    if(error){
      $scope.item = "Missing/Incorrect fields, please try again.";
    }else if(arr){
      $scope.item = [arr[index], index];
    }else{
      $scope.item = "Successfully updated";
    }
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/views/appointmentModal.html',
      controller: 'imgModal',
      size: size,
      resolve: {
        item : function(){
          return $scope.item;
        }
      }
    });
    modalInstance.result.then(function (item) {
      $scope.i = item[1];
      arr.splice($scope.i, 1);
      if($scope.imgNames.length > 0){
        $scope.imgNames.splice($scope.i, 1);
      }
    });
  }


    $scope.imageUpload = function(element){
        var short = element.files[0].name.slice(0, 5) + "..." + element.files[0].name.slice(-3);
        $scope.imgNames.push(short);
        var reader = new FileReader();
        reader.onload = $scope.imageIsLoaded;
        reader.readAsDataURL(element.files[0]);
    }

    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
          $scope.images.push(e.target.result);
        });
    }

}]);

medconnect.controller('Upload', ['$http', 'Upload', '$window', function ($http, Upload, $window){
  //demo of file uploading
  var vm = this;
  vm.submit = function(){
    if (vm.upload_form.file.$valid && vm.file) {
       vm.upload(vm.file)
    }
  }

  vm.upload = function (file){
    Upload.upload({
      url:'/patient/addFile',
      data:{
        file: file,
        dataTypeID: 10,
        dataName: 'work'
      }
    }).then(function (resp) {
        console.log('Success ' + resp.config.data.file.name + ' uploaded')
    }, function (resp) {
        console.log('Error status: ' + resp.status)
    })
  }

}])

medconnect.controller('patientPrescriptions', ['$http', '$scope', '$uibModal', function($http, $scope, $uibModal){
  $scope.init = function(){
    getData()
  }

  $scope.viewPrescription = function(script){
    var props = [script]
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/views/viewPrescriptions.html',
      controller: 'viewPrescriptions',
      resolve: {
        item : function(){
          return props;
        }
      }
    });
    modalInstance.result.then(function() {
      //when we get a prescriptionID, we should splice the prescriptions array on the index of the id
      getData()
    });
  }

  var getData = function(){
    $http.get('/patient/getPrescriptions')
      .success(function(result){
        $scope.prescriptions = result
      })
  }
}])

}());
