(function(){

var medconnect = angular.module("mcPatient", []);

medconnect.controller('PRController', ['$http', '$location', function($http, $location){

  var vm = this;
  vm.error = true;

  var receiveInputs = function(){
    if(vm.email && vm.firstName && vm.lastName && vm.gender && vm.address && vm.phoneNumber && vm.password && vm.passwordConfirm){
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
        console.log(data);
      }).error(function(err){
        console.log('Server error: ' + err);
      })
      $location.url('/')
  }else{
    vm.error = false;
  }

}}]);

medconnect.controller('PatientProfile', ['$http', function($http){

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
        url:'/patient/edit',
        data: {
          'firstName' : vm.firstName,
          'lastName' : vm.lastName,
          'bloodType' : vm.bloodType,
          'address' : vm.address,
          'phone' : vm.phoneNumber
        }

      }).success(function(data){
        console.log(data);
        //$location.url('/patient');
      }).error(function(err){
        vm.error = true;
        vm.message = "Server error";
        console.log('Server error: ' + err);
      })
      //$location.url('/');
    }
}])

}());
