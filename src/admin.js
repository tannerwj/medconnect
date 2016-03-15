const Promise = require('bluebird')
const db = require('../config/db')

exports.add = function (type, data){
  var table = getTableName(type)
  if(!table){ return false }

  return db.query('INSERT INTO '+table+' (name) VALUES (?);', [data]).then(function (result){
    return result[0].affectedRows === 1
  }).catch(function (err){
    return false
  })
}

exports.view = function (type){
  var table = getTableName(type)
  if(!table){ return false }

  return Promise.all([
    db.query('SELECT * FROM '+table+' WHERE active = 1;'),
    db.query('SELECT * FROM '+table+' WHERE active = 0;')
  ]).then(function (result){
    return {
      actives: result[0][0],
      inactives: result[1][0]
    }
  })
}

exports.edit = function (type, name, id){
  var table = getTableName(type)
  if(!table){ return false }

  return db.query('UPDATE '+table+' SET name =? WHERE _id =?;', [name, id]).then(function (result){
    return result[0].affectedRows === 1
  })
}

exports.deactivate = function (type, id){
  var table = getTableName(type)
  if(!table){ return false }

  return db.query('UPDATE '+table+' SET active = 0 WHERE _id =?;', [id]).then(function (result){
    return result[0].affectedRows === 1
  })
}

exports.activate = function (type, id){
  var table = getTableName(type)
  if(!table){ return false }

  return db.query('UPDATE '+table+' SET active = 1 WHERE _id =?;', [id]).then(function (result){
    return result[0].affectedRows === 1
  })
}

exports.delete = function (type, id){
  var table = getTableName(type)
  if(!table){ return false }

  return db.query('DELETE FROM '+table+' WHERE _id =?;', [id]).then(function (result){
    return result[0].affectedRows === 1
  })
}

var getTableName = function (type){
  if(type === 'allergy'){
    return 'Allergies'
  }else if(type === 'specialty'){
    return 'Specialties'
  }else if(type === 'medication'){
    return 'Medications'
  }else if(type === 'datatype'){
    return 'DataType'
  }else{
    return false
  }
}
