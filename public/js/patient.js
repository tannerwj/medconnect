(function(){

var medconnect = angular.module("mcPatient", []);

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
      $scope.open(false)
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

  var d = new Date();
  d.setHours( 0 );
  d.setMinutes( 0 );
  $scope.time = d;
  $scope.date = new Date();

  $scope.open = function (error, size) {

    if(error){
      $scope.item = "Server Error, try back again later please";
    }else{
      $scope.item = "You have successfully requested an appointment!";
    }
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '../views/modal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        item : function(){
          return $scope.item
        }
      }
    });
  };

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
  $scope.details = false;

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
    $http({
      method: 'POST',
      url: '/patient/getAppointmentDetail',
      data: {
        visitID : id
      }
    }).success(function (data) {
      $scope.details = true;
      $scope.editMode = false;
      console.log(data)
      $scope.name = data.visit.firstName + " " + data.visit.lastName;
      $scope.date = data.visit.visitDate;
      $scope.diagnosis = data.visit.diagnosis;
      $scope.symptoms = data.visit.symptoms;

      data.prescriptions.forEach(function(pre, index){
        if(data.prescriptions.length-1 === (index)){
          $scope.prescriptions += pre;
        }else{
          $scope.prescriptions += pre + ", ";
        }
      });

      data.notes.forEach(function(note, index){
        if(data.notes.length-1 === (index)){
          $scope.prescriptions += note;
        }else{
          $scope.prescriptions += note + ", ";
        }
      });

    }).error(function (err) {
      console.log("error")
    })
  }

  $scope.edit = function(){
    $scope.editMode = !$scope.editMode;
  }

  //   var r = new FileReader();
  //
  //   r.onloadend = function(e){
  //     var data = e.target.result;
  //  }
  //  console.log(r.readAsArrayBuffer(f));

  $scope.save = function(){
    var imgList = document.getElementById('file').files;

  }

}]);

}());
