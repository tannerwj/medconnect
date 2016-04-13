const Promise = require('bluebird')
const multer  = require('multer')
const path = require('path')
const fs = require('fs-extra')

const db = require('../config/db')
const acc = require('./account')

var register = function (user){
  return acc.register(user).then(function (result){
    if(!result){ return false }
    return db.query('INSERT INTO PatientProfile (userID, gender, bloodType, address, phone) VALUES (?,?,"",?,?);', [result.id, user.gender, user.address, user.phone]).then(function (result){
      return result[0].affectedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var edit = function (user){
  return Promise.all([
    db.query('UPDATE Users SET lastName =?, firstName =? WHERE userID =?;', [user.last, user.first, user.id]),
    db.query('UPDATE PatientProfile SET bloodType =?, address =?, phone =? WHERE userID =?;', [user.blood, user.address, user.phone, user.id])
  ]).then(function (results){
    return results[0][0].affectedRows === 1 && results[1][0].affectedRows === 1
  }).catch(function (err){
    console.log(err)
    return false
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
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var patientExists = function (id){
  return db.query('SELECT 1 FROM PatientProfile WHERE userID =? LIMIT 1;', [id]).then( function (result){
    return result[0][0] !== undefined
  }).catch(function (err){
    console.log(err)
    return false
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
  }).catch(function (err){
    console.log(err)
    return false
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
  }).catch(function (err){
    console.log(err)
    return false
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
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var getDoctorDetails = function (id){
  return Promise.all([
    db.query('SELECT firstName, lastName FROM Users WHERE userID =? LIMIT 1;', [id]),
    db.query('SELECT address, phone, verified, experience, volunteerNotes, otherNotes, availability FROM DoctorProfile WHERE userID = ? LIMIT 1;', [id]),
    db.query('SELECT name FROM Specialties, SpecialtyDoctor WHERE Specialties._id = SpecialtyDoctor.specialtyID AND SpecialtyDoctor.doctorID = ?;', [id])
  ]).then(function (results){
    if(!results[0][0]){ return false }

    var doctor = results[0][0][0]
    var profile = results[1][0][0]
    var specialties = results[2][0]

    return {
      first: doctor.firstName,
      last: doctor.lastName,
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

var getPatient = function (userId){
  return db.query('SELECT * FROM Users where userID =? ORDER BY lastName, firstName;', [userId])
  .then(function (result){
    return {
      currentPatient: result[0][0]
    }
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var requestAppointment = function (patientId, doctorId, requestedDate){
  var date = new Date(requestedDate)
  return db.query("INSERT INTO Visits (visitStatus, patientID, doctorID, visitDate, diagnosis, symptoms) VALUES (?,?,?,?,'','');", [db.REQUESTED_VISIT, patientId, doctorId, date]).then(function (result){
    return db.query("INSERT INTO Vitals (userID, visitID, vitalsDate, height, weight, BMI, temperature, pulse, respiratoryRate, bloodPressure, bloodOxygenSat) VALUES (?,?,'0000-00-00 00-00-00','','','','','','','','');", [patientId, result[0].insertId])
    .then(function (result){
      return result[0].affectedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var getCurrentAppointments = function (patientID){
  return Promise.all([
    db.query('SELECT Visits.visitID, Visits.visitDate, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.doctorID AND Visits.visitStatus =? AND Visits.patientID =?;', [db.REQUESTED_VISIT, patientID]),
    db.query('SELECT Visits.visitID, Visits.visitDate, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.doctorID AND Visits.visitStatus =? AND Visits.patientID =?;', [db.REJECTED_VISIT, patientID]),
    db.query('SELECT Visits.visitID, Visits.visitDate, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.doctorID AND Visits.visitStatus =? AND Visits.patientID =?;', [db.ACCEPTED_VISIT, patientID]),
  ]).then(function (results){
    return {
      requested: results[0][0],
      rejected: results[1][0],
      accepted: results[2][0]
    }
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var getAppointmentDetail = function (visitID, patientID){
 return Promise.all([
   db.query('SELECT Visits.visitID, Visits.visitStatus, Visits.visitDate, Visits.diagnosis, Visits.symptoms, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.doctorID AND Visits.visitID =? AND Visits.patientID =? LIMIT 1;', [visitID, patientID]),
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

var getPastAppointments = function (patientID){
  return db.query('SELECT Visits.visitID, Visits.visitDate, Users.firstName, Users.lastName FROM Visits, Users WHERE Users.userID = Visits.doctorID AND Visits.visitStatus =? AND Visits.patientID =?;', [db.COMPLETED_VISIT, patientID])
  .then(function (results){
    return results[0]
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var completeAppointment = function (visitID, patientID){
  return db.query('SELECT 1 FROM Visits WHERE visitID =? AND visitStatus =? AND patientID =? LIMIT 1;', [visitID, db.ACCEPTED_VISIT, patientID])
  .then(function (result){
    if(!result[0][0]){ return false }
    return db.query('UPDATE Visits SET visitStatus =? WHERE visitID =?;', [db.COMPLETED_VISIT, visitID]).then(function (result){
      return result[0][0].changedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var deleteRejectedAppointment = function (visitID, patientID){
  return db.query('SELECT 1 FROM Visits WHERE Visits.visitID =? AND Visits.patientID =? AND Visits.visitStatus =? LIMIT 1;', [visitID, patientID, db.REJECTED_VISIT])
  .then(function (result){
    if(!result[0][0]){ return false }
    return db.query('DELETE FROM Visits WHERE visitID =?;', [visitID]).then(function (result){
      return result[0].affectedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var updateRejectedAppointment = function (visitDate, visitID, patientID){
  var date = new Date(visitDate).toISOString().replace(/T/, ' ').replace(/\..+/, '')
  return db.query('SELECT 1 FROM Visits WHERE Visits.visitID =? AND Visits.patientID =? AND Visits.visitStatus =? LIMIT 1;', [visitID, patientID, db.REJECTED_VISIT])
  .then(function (result){
    if(!result[0][0]){ return false }
    return db.query('UPDATE Visits SET visitDate =?, visitStatus =? WHERE visitID =?;', [date, db.REQUESTED_VISIT, visitID]).then(function (result){
      return result[0].affectedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var editAppointmentDetails = function (visitID, diagnosis, symptoms, patientID){
  return db.query('UPDATE Visits SET diagnosis =?, symptoms =? WHERE visitID =? and patientID =?;', [diagnosis, symptoms, visitID, patientID]).then(function (result){
    return result[0].affectedRows === 1
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var hadVisitWithDoctor = function (patientID, visitID){
  if(visitID === 0){ return Promise.resolve({}) }
  return db.query('SELECT doctorID FROM Visits WHERE patientID =? AND visitID =? LIMIT 1;', [patientID, visitID]).then(function (result){
    if(result[0][0]){ return { doctorID: result[0][0].doctorID } }
    return false
  })
}

var addVitals = function (v, patientID){
  //patients do not have to attach vitals to visit
  //but if there is a visit, make sure patient had visit with doctor
  if(!v.visitID){ v.visitID = 0 }
  return hadVisitWithDoctor(patientID, v.visitID).then(function (result){
    if(!result){ return false }
    return db.query('INSERT INTO Vitals (userID, visitID, vitalsDate, height, weight, BMI, temperature, pulse, respiratoryRate, bloodPressure, bloodOxygenSat) VALUES (?,?,?,?,?,?,?,?,?,?,?);', [v.patientID, v.visitID, v.vitalsDate, v.height, v.weight, v.BMI, v.temperature, v.pulse, v.respiratoryRate, v.bloodPressure, v.bloodOxygenSat])
    .then(function (result){
      return result[0].affectedRows === 1
    })
  })
}

var editVitals = function (v, patientID){
  if(!v.visitID){ v.visitID = 0 }
  return hadVisitWithDoctor(patientID, v.visitID).then(function (result){
    if(!result){ return false }
    var vitalsDate = new Date(v.vitalsDate).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    return db.query('UPDATE Vitals SET vitalsDate =?, height =?, weight =?, BMI =?, temperature =?, pulse =?, respiratoryRate =?, bloodPressure =?, bloodOxygenSat =? WHERE visitID =?;',
      [vitalsDate, v.height, v.weight, v.BMI, v.temperature, v.pulse, v.respiratoryRate, v.bloodPressure, v.bloodOxygenSat, v.visitID])
    .then(function (result){
      return result[0].affectedRows === 1
    })
  })
}

var getVitals = function(patientID){
  return db.query('SELECT * FROM Vitals WHERE userID =?;', [patientID])
  .then(function(results){
    return results[0]
  })
}

var addNote = function (n, patientID){
  if(!n.visitID){ n.visitID = 0 }
  return hadVisitWithDoctor(patientID, n.visitID).then(function (result){
    if(!result){ return false }
    return db.query('INSERT INTO Notes (userID, visitID, note) VALUES (?,?,?);', [patientID, n.visitID, n.note])
    .then(function (result){
      return result[0].insertId
    })
  })
}

var getNotes = function(patientID){
  return db.query('SELECT * FROM Notes WHERE userID =?', [patientID])
  .then(function(results){
    return results[0]
  })
}

var removeNote = function (noteID){
  return db.query('DELETE FROM Notes WHERE noteID =?;',  [noteID])
  .then(function (result){
    return result[0].affectedRows === 1
  })
}

var addFile = function (i, patientID, f){
  var dest = ''
  if(!i.visitID){
    i.visitID = 0
    dest = 'patient/'
  }else{
    dest = 'visit/'
  }
  return hadVisitWithDoctor(patientID, i.visitID).then(function (result){
    if(!result){ return false }
    var doctorID = result.doctorID || 0

    var from = path.join(__dirname, '../data/tmp/') + f.filename
    var to = path.join(__dirname, '../data/' + dest + '/') + f.filename

    fs.move(from, to, function (err){
      if(err){ console.log('move err', err) }
    })

    //path accessible by url
    var filePath = '/uploads/' + dest + f.filename

    return db.query('INSERT INTO ExternalData (patientID, doctorID, visitID, dataTypeID, filePath, fileName, dataName) VALUES (?,?,?,?,?,?,?);',
        [patientID, doctorID, i.visitID, i.dataTypeID, filePath, f.filename, i.dataName])
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

var getUploads = function(userID){
  return db.query('SELECT dt.name, ed.* from ExternalData ed join DataType dt on dt._id = ed.dataTypeID where ed.patientID =?', [userID])
    .then(function(results){
      return results[0]
    })
}

var addPrescription = function (p, patientID){
  if(!p.visitID){ p.visitID = 0 }
  if(!p.doctorID){ p.doctorID = 0 }
  return hadVisitWithDoctor(patientID, p.visitID).then(function (result){
    if(!result){ return false }
    return db.query('INSERT INTO MedicationPatient (medicationID, userID, visitID, dosage, startDate, stopDate, notes, doctorID, doctorName) VALUES (?,?,?,?,?,?,?,0,?);',
      [p.medicationID, patientID, p.visitID, p.dosage, p.startDate, p.endDate, p.notes, p.doctorID, p.doctorName])
    .then(function (result){
      return result[0].affectedRows === 1
    })
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var getPrescriptions = function (patientID){
  return db.query('SELECT m.name, mp.* FROM MedicationPatient mp JOIN medications m ON m._id = mp.medicationID WHERE mp.userID =?;', [patientID])
  .then(function (results){
    return results[0]
  }).catch(function (err){
    console.log(err)
    return false
  })
}

var removePrescription = function (medicationID, patientID, visitID){
  return db.query('DELETE FROM MedicationPatient WHERE medicationID =? AND userID =? AND visitID =?;', [medicationID, patientID, visitID])
  .then(function (result){
    return result[0].affectedRows === 1
  }).catch(function (err){
    console.log(err)
    return false
  })
}

module.exports = {
  register: register,
  edit: edit,
  deletePatient: deletePatient,
  info: info,
  getDoctors: getDoctors,
  getDoctor: getDoctor,
  getDoctorDetails: getDoctorDetails,
  getPatient: getPatient,
  requestAppointment: requestAppointment,
  getCurrentAppointments: getCurrentAppointments,
  getAppointmentDetail: getAppointmentDetail,
  getPastAppointments: getPastAppointments,
  completeAppointment: completeAppointment,
  deleteRejectedAppointment: deleteRejectedAppointment,
  updateRejectedAppointment: updateRejectedAppointment,
  editAppointmentDetails: editAppointmentDetails,
  addVitals: addVitals,
  editVitals: editVitals,
  getVitals: getVitals,
  addNote: addNote,
  getNotes: getNotes,
  removeNote: removeNote,
  addFile: addFile,
  getUploads: getUploads,
  addPrescription: addPrescription,
  getPrescriptions: getPrescriptions,
  removePrescription: removePrescription
}
