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
    db.query('UPDATE Users SET email =?, lastName =?, firstName =? WHERE userID =?;', [user.email, user.last, user.first, user.id]),
    db.query('UPDATE PatientProfile SET bloodType =?, address =?, phone =? WHERE userID =?;', [user.blood, user.address, user.phone, user.id])
  ]).then(function (results){
    return results[0][0].changedRows === 1 && results[1][0].changedRows === 1
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
        return results[0].changedRows && results[1]
      })
    }
  })
}

var patientExists = function (id){
  return db.query('SELECT 1 FROM PatientProfile WHERE userID =? LIMIT 1;', [id]).then( function (result){
    return result[0][0] !== undefined
  })
}

module.exports = {
  register: register,
  edit: edit,
  deletePatient: deletePatient
}
