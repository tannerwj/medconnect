const Promise = require('bluebird')
const multer  = require('multer')
const path = require('path')
const fs = require('fs-extra')

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
      exp : profile.experience,
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
  return db.query('SELECT Visits.visitID, Visits.visitStatus, Visits.visitDate, Visits.diagnosis, Visits.symptoms, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.patientID AND Visits.visitID =? AND Visits.doctorID =? LIMIT 1;', [visitID, doctorID])
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
      return result[0].changedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var getAppointmentDetail = function (visitID, doctorID){
 return Promise.all([
   db.query('SELECT Visits.visitID, Visits.visitStatus, Visits.visitDate, Visits.diagnosis, Visits.symptoms, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.patientID AND Visits.visitID =? AND Visits.doctorID =? LIMIT 1;', [visitID, doctorID]),
   db.query('SELECT noteID, note FROM Notes WHERE visitID =?;', [visitID]),
   db.query('SELECT * FROM Vitals WHERE visitID =? LIMIT 1;', [visitID]),
   db.query('SELECT * FROM MedicationPatient, Medications WHERE MedicationPatient.medicationID = Medications._id AND MedicationPatient.visitID =?;', [visitID]),
   db.query('SELECT ExternalData.dataID, ExternalData.filePath, ExternalData.dataName, DataType.name FROM ExternalData, DataType WHERE ExternalData.dataTypeID = DataType._id AND ExternalData.visitID =?;', [visitID])
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
  return db.query('SELECT DISTINCT(Users.userID), Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.patientID AND Visits.visitStatus =? AND Visits.doctorID =?;', [db.COMPLETED_VISIT, doctorID])
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
  return db.query('SELECT 1 FROM Visits WHERE visitID =? AND visitStatus =? AND doctorID =? LIMIT 1;', [visitID, db.ACCEPTED_VISIT, doctorID])
  .then(function (result){
    if(!result[0][0]){ return false }
    return db.query('UPDATE Visits SET visitStatus =? WHERE visitID =?;', [db.COMPLETED_VISIT, visitID]).then(function (result){
      return result[0].changedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var editAppointmentDetails = function (visitID, diagnosis, symptoms, doctorID){
  return db.query('UPDATE Visits SET diagnosis =?, symptoms =? WHERE visitID =? AND doctorID =?;', [diagnosis, symptoms, visitID, doctorID]).then(function (result){
    return result[0].affectedRows === 1
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var hadVisitWithPatient = function (doctorID, visitID){
  return db.query('SELECT patientID FROM Visits WHERE doctorID =? AND visitID =? LIMIT 1;', [doctorID, visitID]).then(function (result){
    if(result[0][0]){ return { patientID: result[0][0].patientID } }
    return false
  })
}

var addVitals = function (v, doctorID){
  //doctors have to attach vitals to visit
  if(!v.visitID){ return false }
  //make sure doctor had visit with patient
  return hadVisitWithPatient(doctorID, v.visitID).then(function (result){
    if(!result){ return false }
    return db.query('INSERT INTO Vitals (userID, visitID, vitalsDate, height, weight, BMI, temperature, pulse, respiratoryRate, bloodPressure, bloodOxygenSat) VALUES (?,?,?,?,?,?,?,?,?,?,?);',
      [v.patientID, v.visitID, v.vitalsDate, v.height, v.weight, v.BMI, v.temperature, v.pulse, v.respiratoryRate, v.bloodPressure, v.bloodOxygenSat])
    .then(function (result){
      return result[0].affectedRows === 1
    })
  })
}

var editVitals = function (v, doctorID){
  if(!v.visitID){ return false }
  return hadVisitWithPatient(doctorID, v.visitID).then(function (result){
    if(!result){ return false }
    var vitalsDate = new Date(v.vitalsDate).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    return db.query('UPDATE Vitals SET vitalsDate =?, height =?, weight =?, BMI =?, temperature =?, pulse =?, respiratoryRate =?, bloodPressure =?, bloodOxygenSat =? WHERE visitID =?;',
      [vitalsDate, v.height, v.weight, v.BMI, v.temperature, v.pulse, v.respiratoryRate, v.bloodPressure, v.bloodOxygenSat, v.visitID])
    .then(function (result){
      return result[0].affectedRows === 1
    })
  })
}

var addNote = function (n, doctorID){
  if(!n.visitID){ return false }
  return hadVisitWithPatient(doctorID, n.visitID).then(function (result){
    if(!result){ return false }
    return db.query('INSERT INTO Notes (userID, visitID, note) VALUES (?,?,?);', [doctorID, n.visitID, n.note])
    .then(function (result){
      return result[0].insertId
    })
  })
}

var removeNote = function (noteID){
  return db.query('DELETE FROM Notes WHERE noteID =?;',  [noteID])
  .then(function (result){
    return result[0].affectedRows === 1
  })
}

var addFile = function (i, doctorID, f){
  if(!i.visitID){ return false }
  return hadVisitWithPatient(doctorID, i.visitID).then(function (result){
    if(!result){ return false }

    var from = path.join(__dirname, '../data/tmp/') + f.filename
    var to = path.join(__dirname, '../data/visit/') + f.filename

    fs.move(from, to, function (err){
      if(err){ console.log('move err', err) }
    })

    //path accessible by url
    var filePath = '/uploads/visit/' + f.filename

    return db.query('INSERT INTO ExternalData (patientID, doctorID, visitID, dataTypeID, filePath, fileName, dataName) VALUES (?,?,?,?,?,?,?);',
        [result.patientID, doctorID, i.visitID, i.dataTypeID, filePath, f.filename, i.dataName])
    .then(function (result){
      if(result[0].affectedRows === 1){
        return db.query('SELECT ExternalData.dataID, ExternalData.filePath, ExternalData.dataName, DataType.name FROM ExternalData, DataType WHERE ExternalData.dataTypeID = DataType._id AND ExternalData.dataID =? LIMIT 1;', [result[0].insertId])
        .then(function (result){
          return result[0][0]
        })
      }else{
        return false
      }
    }).catch(function (err){
      console.log(err)
      return false
    })
  })
}

var addPrescription = function (p, doctorID, doctorName){
  if(!p.visitID){ return false }
  return hadVisitWithPatient(doctorID, p.visitID).then(function (result){
    if(!result){ return false }
    return db.query('INSERT INTO MedicationPatient (medicationID, userID, visitID, dosage, startDate, stopDate, notes, doctorID, doctorName) VALUES (?,?,?,?,?,?,?,?,?);',
      [p.medicationID, result.patientID, p.visitID, p.dosage, p.startDate, p.endDate, p.notes, doctorID, doctorName])
    .then(function (result){
      return result[0].affectedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var removePrescription = function (medicationID, doctorID, visitID){
  if(!visitID){ return false }
  return hadVisitWithPatient(doctorID, visitID).then(function (result){
    if(!result){ return false }
    return db.query('DELETE FROM MedicationPatient WHERE medicationID =? AND visitID =?;',  [medicationID, visitID])
    .then(function (result){
      return result[0].affectedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
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
  handleRequestedAppointment: handleRequestedAppointment,
  getAppointmentDetail: getAppointmentDetail,
  getPastPatients: getPastPatients,
  getPastAppointments: getPastAppointments,
  completeAppointment: completeAppointment,
  editAppointmentDetails: editAppointmentDetails,
  addVitals: addVitals,
  editVitals: editVitals,
  addNote: addNote,
  removeNote: removeNote,
  addFile: addFile,
  addPrescription: addPrescription,
  removePrescription: removePrescription
}
