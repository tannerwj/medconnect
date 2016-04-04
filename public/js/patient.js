(function(){

var medconnect = angular.module("mcPatient", []);

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
        console.log('Server error: ' + err);
      })
  }

}])

medconnect.controller('PatientSearch', ['$http', '$location', 'doctorInfo', function($http, $location, doctorInfo){
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
    doctorInfo.saveDoctorInfo(doctor);
    $location.url("/patient/seeDoctor");
  }


}]);

medconnect.controller('seeDoctor', ['$http', '$location', 'doctorInfo', function($http, $location, doctorInfo){

  var vm = this;
  var doctor = doctorInfo.getDoctorInfo();
  vm.id = doctor.userID;
  vm.name = doctor.name;
  vm.location = doctor.location;
  vm.specialties = doctor.specialties;
  vm.experience = doctor.experience;
  vm.notes = doctor.notes;
  vm.volunteerNotes = doctor.volunteerNotes;
  vm.verified = doctor.verified;

  vm.next = function(){
    $location.url("/patient/seeDoctorSchedule");
  }
}]);

medconnect.controller('seeDoctorSchedule', ['$http', '$location', 'doctorInfo', function($http, $location, doctorInfo){

  var vm = this;
  var doctor = doctorInfo.getDoctorInfo();
  vm.availability = doctor.availability;
  vm.lastName = doctor.name.split(" ")[1];

  var a = JSON.parse(vm.availability);
  vm.ms = a[0][1];
  vm.me = a[0][2];
  vm.tus = a[1][1];
  vm.tue = a[1][2];
  vm.ws = a[2][1];
  vm.we = a[2][2];
  vm.ths = a[3][1];
  vm.the = a[3][2];
  vm.fs = a[4][1];
  vm.fe = a[4][2];
  vm.sas = a[5][1];
  vm.sae = a[5][2];
  vm.sus = a[6][1];
  vm.sue = a[6][2];

  vm.submit = function(){
    $location.url("/patient/requestAppointment");
  }

}]);

medconnect.controller('requestAppointment', ['$scope', '$http', '$location', 'doctorInfo', '$uibModal', function($scope, $http, $location, doctorInfo, $uibModal){

  var doctor = doctorInfo.getDoctorInfo();
  $scope.availability = doctor.availability;
  $scope.lastName = doctor.name.split(" ")[1];

  var d = new Date();
  d.setHours( 0 );
  d.setMinutes( 0 );
  $scope.time = d;
  $scope.date = new Date();

  $scope.submit = function(){

    // $http({
    //   method: 'POST',
    //   url: '/patient/requestAppointment',
    //   data: {
    //     id : doctor.id,
    //     date : $scope.date,
    //     time : $scope.time
    //   }
    // }).success(function (data) {
    //   $scope.open(false)
    // }).error(function (err) {
    //   $scope.open(true)
    // })

  }

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

}());
