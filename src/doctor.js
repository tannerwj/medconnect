const Promise = require('bluebird')
const db = require('../config/db')

var getDoctorDetails = function (id){
  return Promise.all([
    db.query('SELECT locationID, verified, experience, volunteerNotes, otherNotes FROM DoctorProfile WHERE userID = ? LIMIT 1;', [id]),
    db.query('SELECT specialtyName FROM Specialties, SpecialtyDoctor WHERE Specialties.specialtyID = SpecialtyDoctor.specialtyID AND SpecialtyDoctor.doctorID = ?;', [id])
  ]).then(function (results){
    if(!results[0][0]){ return false }
    
    var profile = results[0][0][0]
    var specialties = results[1][0]

    var doctor = {
      loc: profile.locationID,
      ver: profile.verified,
      vol: profile.volunteerNotes,
      notes: profile.otherNotes,
      specialties: specialties
    }

    return doctor
  })
}

module.exports = {
  getDoctorDetails: getDoctorDetails
}
