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
  }).catch(function (err){
    console.log(err)
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
  }).catch(function (err){
    console.log(err)
    return false
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
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var doctorExists = function (id){
  return db.query('SELECT 1 FROM DoctorProfile WHERE userID =? LIMIT 1;', [id]).then( function (result){
    return result[0][0] !== undefined
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var getDoctorDetails = function (id){
  return Promise.all([
    db.query('SELECT address, phone, verified, experience, volunteerNotes, otherNotes, availability FROM DoctorProfile WHERE userID = ? LIMIT 1;', [id]),
    db.query('SELECT name FROM Specialties, SpecialtyDoctor WHERE Specialties._id = SpecialtyDoctor.specialtyID AND SpecialtyDoctor.doctorID = ?;', [id])
  ]).then(function (results){
    if(!results[0][0]){ return false }

    var profile = results[0][0][0]
    var specialties = results[1][0]

    return {
      loc: profile.address,
      phone: profile.phone,
      ver: profile.verified,
      vol: profile.volunteerNotes,
      notes: profile.otherNotes,
      availability: profile.availability,
      specialties: specialties
    }
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var info = function (id){
  return Promise.all([
    db.query('SELECT email, firstName, lastName FROM Users WHERE userID =? LIMIT 1;', [id]),
    db.query('SELECT address, phone, verified, verificationCode, experience, volunteerNotes, otherNotes, availability FROM DoctorProfile WHERE userID =? LIMIT 1;', [id]),
    db.query('SELECT Specialties._id, Specialties.name FROM Specialties, SpecialtyDoctor WHERE Specialties._id = SpecialtyDoctor.specialtyID AND SpecialtyDoctor.doctorID = ?;', [id])
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
      availability: tmp2.availability,
      specialties: specialties
    }
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var getDoctor = function (userId){
  return Promise.all([
    db.query('SELECT * FROM Users WHERE userID =? ORDER BY lastName, firstName;', [userId])
  ]).then(function (result){
    return {
      currentDoctor: result[0][0][0]
    }
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var setAvailability = function (data, userId){
  return db.query('UPDATE DoctorProfile SET availability =? WHERE userID =?;', [data, userId]).then(function (result){
    return result[0].affectedRows === 1
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var getCurrentAppointments = function (doctorID){
  return Promise.all([
    db.query('SELECT Visits.visitID, Visits.visitDate, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.patientID AND Visits.visitStatus =? AND Visits.doctorID =?;', [db.REQUESTED_VISIT, doctorID]),
    db.query('SELECT Visits.visitID, Visits.visitDate, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.patientID AND Visits.visitStatus =? AND Visits.doctorID =?;', [db.ACCEPTED_VISIT, doctorID]),
  ]).then(function (results){
    return {
      requested: results[0][0],
      accepted: results[1][0]
    }
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var getRequestedAppointment = function (visitID, doctorID){
  return db.query('SELECT Visits.visitStatus, Visits.visitDate, Visits.diagnosis, Visits.symptoms, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.patientID AND Visits.visitID =? AND Visits.doctorID =? LIMIT 1;', [visitID, doctorID])
  .then(function (result){
    return result[0][0]
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var handleRequestedAppointment = function (visitID, acceptVisit, doctorID){
  return db.query('SELECT 1 FROM Visits WHERE Visits.visitID =? AND Visits.doctorID =? LIMIT 1;', [visitID, doctorID])
  .then(function (result){
    if(!result[0][0]){ return false }
    var status = acceptVisit ? db.ACCEPTED_VISIT : db.REJECTED_VISIT
    return db.query('UPDATE Visits SET visitStatus =? WHERE visitID =?;', [status, visitID]).then(function (result){
      return results[0][0].changedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var getAppointmentDetail = function (visitID, doctorID){
 return Promise.all([
   db.query('SELECT Visits.visitStatus, Visits.visitDate, Visits.diagnosis, Visits.symptoms, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.patientID AND Visits.visitID =? AND Visits.doctorID =? LIMIT 1;', [visitID, doctorID]),
   db.query('SELECT noteID, note FROM Notes WHERE visitID =?;', [visitID]),
   db.query('SELECT * FROM Vitals WHERE visitID =? LIMIT 1;', [visitID]),
   db.query('SELECT * FROM MedicationPatient, Medications WHERE MedicationPatient.medicationID = Medications._id AND MedicationPatient.visitID =?;', [visitID]),
   db.query('SELECT * FROM ExternalData, DataType WHERE ExternalData.dataID = DataType._id AND ExternalData.visitID =?;', [visitID])
 ]).then(function (results){
   var visit = results[0][0][0]
   if(!visit){ return false }

   return {
     visit: visit,
     notes: results[1][0],
     vitals: results[2][0][0],
     prescriptions: results[3][0],
     images: results[4][0]
   }
 }).catch(function (err){
   console.log(err)
   return false
 })
}

var getPastPatients = function (doctorID){
  return db.query('SELECT DISTINCT(Users.userID), Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.patientID AND Visits.visitStatus =? AND Visits.doctorID =? LIMIT 1;', [db.COMPLETED_VISIT, doctorID])
  .then(function (result){
    return result[0]
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var getPastAppointments = function (doctorID, patientID){
  return db.query('SELECT Visits.visitID, Visits.visitDate, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.patientID AND Visits.visitStatus =? AND Visits.doctorID =? AND Visits.patientID =?;', [db.COMPLETED_VISIT, doctorID, patientID])
  .then(function (results){
    return results[0]
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var completeAppointment = function (visitID, doctorID){
  return db.query('SELECT 1 FROM Visits WHERE Visits.visitID =? AND Visits.doctorID =? LIMIT 1;', [visitID, doctorID])
  .then(function (result){
    if(!result[0][0]){ return false }
    return db.query('UPDATE Visits SET visitStatus =? WHERE visitID =?;', [db.COMPLETED_VISIT, visitID]).then(function (result){
      return results[0][0].changedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var editAppointmentDetails = function (visitID, diagnosis, symptoms, doctorID){
  return db.query('SELECT 1 FROM Visits WHERE Visits.visitID =? AND Visits.doctorID =? LIMIT 1;', [visitID, doctorID])
  .then(function (result){
    if(!result[0][0]){ return false }
    return db.query('UPDATE Visits SET diagnosis =?, symptoms =? WHERE visitID =?;', [diagnosis, symptoms, visitID]).then(function (result){
      return results[0][0].affectedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var addVitals = function (vitals, doctorID){

}

var addNote = function (note, doctorID){

}

var addImage = function (image, doctorID){

}

var addPrescription = function (prescription, doctorID){

}

module.exports = {
  register: register,
  edit: edit,
  deleteDoctor: deleteDoctor,
  getDoctorDetails: getDoctorDetails,
  info: info,
  getDoctor: getDoctor,
  setAvailability: setAvailability,
  getCurrentAppointments: getCurrentAppointments,
  getRequestedAppointment: getRequestedAppointment,
  getAppointmentDetail: getAppointmentDetail,
  getPastPatients: getPastPatients,
  getPastAppointments: getPastAppointments,
  completeAppointment: completeAppointment,
  editAppointmentDetails: editAppointmentDetails,
  addVitals: addVitals,
  addNote: addNote,
  addImage: addImage,
  addPrescription: addPrescription
}
