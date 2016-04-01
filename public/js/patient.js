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


}]);

}());
