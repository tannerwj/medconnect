const Promise = require('bluebird')
const db = require('../config/db')
const acc = require('./account')

var register = function (user){
  return acc.register(user).then(function (result){
    if(result){
      return db.query('INSERT INTO DoctorProfile (userID, address, phone, verified, verificationCode, experience, volunteerNotes, otherNotes) VALUES (?,?,?,0,?,"","","");', [result.id, user.address, user.phone, user.code]).then(function (result){
        return result[0].affectedRows === 1
      })
    }
    return false
  })
}

var edit = function (user){
  return Promise.all([
    db.query('UPDATE Users SET lastName =?, firstName =? WHERE userID =?;', [user.last, user.first, user.id]),
    db.query('UPDATE DoctorProfile SET address =?, phone =?, verificationCode =?, experience =?, volunteerNotes =?, otherNotes =? WHERE userID =?;', [user.address, user.phone, user.code, user.exp, user.volunteer, user.other, user.id]),
    db.query('DELETE FROM SpecialtyDoctor WHERE doctorID =?;', [user.id]).then(function (){
      return Promise.map(user.specialties, function (id){
        return db.query('INSERT INTO SpecialtyDoctor VALUES (?,?);',[id, user.id])
      })
    })
  ]).then(function (results){
    return results[0][0].affectedRows === 1 && results[1][0].affectedRows === 1
  })
}

var deleteDoctor = function (id){
  return Promise.all([
    acc.userExists(id),
    doctorExists(id)
  ]).then(function (exists){
    if(exists[0] && exists[1]){
      return Promise.all([
        db.query('DELETE FROM DoctorProfile WHERE userID=?;', [id]),
        acc.deleteUser(id)
      ]).then(function (results){
        return results[0].affectedRows && results[1]
      })
    }
  })
}

var doctorExists = function (id){
  return db.query('SELECT 1 FROM DoctorProfile WHERE userID =? LIMIT 1;', [id]).then( function (result){
    return result[0][0] !== undefined
  })
}

var getDoctorDetails = function (id){
  return Promise.all([
    db.query('SELECT address, verified, experience, volunteerNotes, otherNotes FROM DoctorProfile WHERE userID = ? LIMIT 1;', [id]),
    db.query('SELECT name FROM Specialties, SpecialtyDoctor WHERE Specialties._id = SpecialtyDoctor.specialtyID AND SpecialtyDoctor.doctorID = ?;', [id])
  ]).then(function (results){
    if(!results[0][0]){ return false }

    var profile = results[0][0][0]
    var specialties = results[1][0]

    var doctor = {
      loc: profile.address,
      phone: profile.phone,
      ver: profile.verified,
      vol: profile.volunteerNotes,
      notes: profile.otherNotes,
      specialties: specialties
    }

    return doctor
  })
}

var info = function (id){
  return Promise.all([
    db.query('SELECT email, firstName, lastName FROM Users WHERE userID =? LIMIT 1;', [id]),
    db.query('SELECT address, phone, verified, verificationCode, experience, volunteerNotes, otherNotes FROM DoctorProfile WHERE userID =? LIMIT 1;', [id]),
    db.query('SELECT specialtyID AS _id, name FROM Specialties, SpecialtyDoctor WddHERE Specialties._id = SpecialtyDoctor.specialtyID AND SpecialtyDoctor.doctorID = ?;', [id])
]).then(function (results){
    var tmp1 = results[0][0][0]
    var tmp2 = results[1][0][0]
    var specialties = results[2][0]

    if(!tmp1 || !tmp2) return false

    return {
      email: tmp1.email,
      firstName: tmp1.firstName,
      lastName: tmp1.lastName,
      address: tmp2.address,
      phone: tmp2.phone,
      ver: tmp2.verified,
      code: tmp2.verificationCode,
      exp: tmp2.experience,
      vol: tmp2.volunteerNotes,
      notes: tmp2.otherNotes,
      specialties: specialties
    }
  })
}

module.exports = {
  register: register,
  edit: edit,
  deleteDoctor: deleteDoctor,
  getDoctorDetails: getDoctorDetails,
  info: info
}
