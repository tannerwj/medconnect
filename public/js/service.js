(function(){

  var medconnect = angular.module("mcService", []);

  medconnect.service('doctorInfo', function($http){

  var obj = {};

  var saveDoctorInfo = function(doctor){

    $http({
      method:'POST',
      url:'/doctor/specific-doctor',
      data: {
        'id' : doctor.userID
      }
    }).success(function(data){

      obj = {
        id : doctor.userID,
        name : doctor.name,
        location : doctor.address,
        specialties : doctor.specialties,
        experience : doctor.exp,
        notes : data.notes,
        volunteerNotes : data.vol,
        verified : data.ver,
        availability : data.availability
      }
    }).error(function(err){
      console.log('Server error: ' + err);
    })
  }

  var getDoctorInfo = function(){
    console.log(obj);
    return obj;
  }

  return {
    saveDoctorInfo : saveDoctorInfo,
    getDoctorInfo : getDoctorInfo
  }

  })
}());
