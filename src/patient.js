const Promise = require('bluebird')
const db = require('../config/db')
const acc = require('./account')

var register = function (user){
  return acc.register(user).then(function (result){
    if(result){
      return db.query('INSERT INTO PatientProfile (userID, gender, bloodType, address, phone) VALUES (?,?,"",?,?);', [result.id, user.gender, user.address, user.phone]).then(function (result){
        return result[0].affectedRows === 1
      })
    }
    return false
  })
}

var edit = function (user){
  return Promise.all([
    db.query('UPDATE Users SET lastName =?, firstName =? WHERE userID =?;', [user.last, user.first, user.id]),
    db.query('UPDATE PatientProfile SET bloodType =?, address =?, phone =? WHERE userID =?;', [user.blood, user.address, user.phone, user.id])
  ]).then(function (results){
    return results[0][0].affectedRows === 1 && results[1][0].affectedRows === 1
  })
}

var deletePatient = function (id){
  return Promise.all([
    acc.userExists(id),
    patientExists(id)
  ]).then(function (exists){
    if(exists[0] && exists[1]){
      return Promise.all([
        db.query('DELETE FROM PatientProfile WHERE userID=?;', [id]),
        acc.deleteUser(id)
      ]).then(function (results){
        return results[0].affectedRows && results[1]
      })
    }
  })
}

var patientExists = function (id){
  return db.query('SELECT 1 FROM PatientProfile WHERE userID =? LIMIT 1;', [id]).then( function (result){
    return result[0][0] !== undefined
  })
}

var info = function (id){
  return Promise.all([
    db.query('SELECT email, firstName, lastName FROM Users WHERE userID =? LIMIT 1;', [id]),
    db.query('SELECT bloodType, address, phone FROM PatientProfile WHERE userID =? LIMIT 1;', [id])
  ]).then(function (results){
    var tmp1 = results[0][0][0]
    var tmp2 = results[1][0][0]

    if(!tmp1 || !tmp2) return false

    return {
      email: tmp1.email,
      firstName: tmp1.firstName,
      lastName: tmp1.lastName,
      bloodType: tmp2.bloodType,
      address: tmp2.address,
      phone: tmp2.phone
    }
  })
}

var getDoctors = function (){
  return db.query('SELECT userID, address, experience FROM DoctorProfile;').then(function (doctors){
    return Promise.map(doctors[0], function (doctor){
      return Promise.all([
        db.query('SELECT firstName, lastName FROM Users WHERE userID =?;', doctor.userID),
        db.query('SELECT name FROM Specialties, SpecialtyDoctor WHERE Specialties._id = SpecialtyDoctor.specialtyID AND SpecialtyDoctor.doctorID =?;', [doctor.userID])
      ]).then(function (results){
        var tmp1 = results[0][0][0]
        var specs = results[1][0]
        var tmp = []
        for(var o in specs) {
  				var spec = specs[o]
  				tmp.push(spec.name)
  			}

        return {
          userID: doctor.userID,
          name: tmp1.firstName + ' ' + tmp1.lastName,
          address: doctor.address,
          exp: doctor.experience,
          specialties: tmp.join(', ')
        }
      })
    })
  })
}

var getDoctor = function (id){
  return db.query('SELECT phone, verified, volunteerNotes, otherNotes FROM DoctorProfile WHERE userID =? LIMIT 1;', [id]).then(function (results){
    if(!results[0]){ return false }

    var profile = results[0][0]

    return {
      phone: profile.phone,
      ver: profile.verified,
      vol: profile.volunteerNotes,
      notes: profile.otherNotes
    }
  })
}

var getPatient = function (userId){
  return Promise.all([
    db.query('SELECT * FROM Users where userID = ? order by lastName, firstName;', [userId])
  ]).then(function (result){
    return {
      currentPatient: result[0][0][0]
    }
  })
}

module.exports = {
  register: register,
  edit: edit,
  deletePatient: deletePatient,
  info: info,
  getDoctors: getDoctors,
  getDoctor: getDoctor,
  getPatient: getPatient
}
