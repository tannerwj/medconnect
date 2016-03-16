const Promise = require('bluebird')
const db = require('../config/db')

var getAllergies = function (){
  return db.query('SELECT _id, name FROM Allergies WHERE active = 1;').then( function (result){
    return result[0]
  })
}

var getMedications= function (){
  return db.query('SELECT _id, name FROM Medications WHERE active = 1;').then( function (result){
    return result[0]
  })
}

var getSpecialties = function (){
  return db.query('SELECT _id, name FROM Specialties WHERE active = 1;').then( function (result){
    return result[0]
  })
}

var getDataTypes = function (){
  return db.query('SELECT _id, name FROM DataType WHERE active = 1;').then( function (result){
    return result[0]
  })
}

exports.getData = function (type){
  if(type === 'allergies'){
    return getAllergies()
  }else if(type === 'medications'){
    return getMedications()
  }else if(type === 'specialties'){
    return getSpecialties()
  }else if(type === 'datatypes'){
    return getDataTypes()
  }else{
    return false
  }
}
