const bcrypt = require('bcrypt-nodejs')
const db = require('../config/db')

const BCRYPT_ROUNDS = 10

var register = function (user){
  return emailExists(user.email).then(function (exists){
    if(!exists){
			return new Promise(function (resolve, reject){
        bcrypt.genSalt(BCRYPT_ROUNDS, function (salt){
          bcrypt.hash(user.pass, salt, null, function (err, hash) {
            if(err) return reject(err)
            return resolve(db.query('INSERT INTO Users (userType, email, firstName, lastName, password) VALUES (?,?,?,?,?);', [user.type, user.email, user.first, user.last, hash]).then( function (result){
              return { id: result[0].insertId }
            }))
          })
        })
      })
		}
    return false
	})
}

var changePassword = function(newPass, oldPass, currentPass, userId){
  return new Promise(function(resolve, reject){
    bcrypt.genSalt(BCRYPT_ROUNDS, function (salt){
      bcrypt.hash(oldPass, salt, null, function (err, hash) {
        if(err) return reject(err)
        bcrypt.compare(hash, currentPass, function (err, res) {
          if(res){
            bcrypt.genSalt(BCRYPT_ROUNDS, function (salt){
              bcrypt.hash(newPass, salt, null, function (err, hash2) {
                if(err) return reject(err)
                  return resolve(db.query('UPDATE Users set password = ? where userID = ?', [hash2, userId]).then( function (result){
                  return result[0][0] !== undefined
                }))
              })
            })
          }
        })
      })
    })
  })
}

var deleteUser = function (id){
  return userExists(id).then( function (exists){
    if(exists){
      return db.query('DELETE FROM Users WHERE userID =?;', [id]).then( function (result){
        return result[0].affectedRows === 1
      })
    }
  })
}

var emailExists = function (email){
  return db.query('SELECT 1 FROM Users WHERE email=? LIMIT 1;', [email]).then( function (result){
    return result[0][0] !== undefined
  })
}

var userExists = function (id){
  return db.query('SELECT 1 FROM Users WHERE userID=? LIMIT 1;', [id]).then( function (result){
    return result[0][0] !== undefined
  })
}

var findUserByEmail = function (email){
  return db.query('SELECT * FROM Users WHERE email =? LIMIT 1;', [email]).then(function (result){
    return result[0][0]
  })
}

var findUserById = function (id){
  return db.query('SELECT * FROM Users WHERE userID =? LIMIT 1;', [id]).then(function (result){
    return result[0][0]
  })
}

module.exports = {
  register: register,
  deleteUser: deleteUser,
  findUserById: findUserById,
  findUserByEmail: findUserByEmail,
  userExists: userExists,
  changePasswrd: changePassword
}
