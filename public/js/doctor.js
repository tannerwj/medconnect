(function(){

  var medconnect = angular.module("mcDoctor", []);

  medconnect.controller('DoctorProfile', ['$http', function($http){

    var vm = this;
    vm.error = false;
    vm.editMode = false;
    vm.message = "";

    vm.edit = function(){
      if(!vm.editMode){
        vm.editMode = true;
      }else{
        vm.editMode = false;
      }
    }

    vm.register = function(){
        $http({
          method:'POST',
          url:'/doctor/edit',
          data: {
            'email' : vm.email,
            'firstName' : vm.firstName,
            'lastName' : vm.lastName,
            'address' : vm.address,
            'phone' : vm.phoneNumber,
            'experience' : vm.experience,
            'volunteerNotes' : vm.volunteerNotes,
            'otherNotes' : vm.otherNotes
            //'code' : vm.code
          }
        }).success(function(data){
          console.log(data);
          // $location.url('/doctor');
        }).error(function(err){
          vm.error = true;
          vm.message = "Server error";
          console.log('Server error: ' + err);
        })
        //$location.url('/');
      }
  }]);

  medconnect.controller('DRController', ['$http', '$location', function($http, $location){

    var vm = this;
    vm.error = true;

    var receiveInputs = function(){
      if(vm.email && vm.firstName && vm.lastName && vm.address && vm.phoneNumber && vm.password && vm.passwordConfirm && vm.code){
        if(vm.password === vm.passwordConfirm){
          return true;
        }
      }
      return false;
    }

    vm.register = function(){
      if(receiveInputs()){
        $http({
          method:'POST',
          url:'/doctor/register',
          data: {
            'email' : vm.email,
            'first' : vm.firstName,
            'last' : vm.lastName,
            'address' : vm.address,
            'phone' : vm.phoneNumber,
            'password': vm.password,
            'code' : vm.code
          }
        }).success(function(data){
          console.log(data);
        }).error(function(err){
          console.log('Server error: ' + err);
        })
        $location.url('/')
    }else{
      vm.error = false;
    }
  }

  }]);

  medconnect.controller('VerifyDoctor', ['$http', function($http){

  }])

}());
