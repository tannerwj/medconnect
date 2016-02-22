const bcrypt = require(process.env.BCRYPT || 'bcryptjs')
const db = require('../config/db')

const BCRYPT_ROUNDS = 10

var register = function (user){
  return userExists(user).then( function (exists){
    if(!exists){
			return new Promise( function (resolve, reject){
        bcrypt.genSalt(BCRYPT_ROUNDS, function (salt){
          bcrypt.hash(user.pass, salt, null, function (err, hash) {
            if(err) return reject(err)
            return resolve(db.query('INSERT INTO Users (userType, email, lastName, firstName, password) VALUES (?,?,?,?,?);', [user.type, user.email, user.first, user.last, hash]).then( function (result){
              return true
            }))
          })
        })
      })
		}
    return false
	})
}

var deleteUser = function (user){
  return userExists(user).then( function (exists){
    if(exists){
      return db.query('DELETE FROM Users WHERE email=?;', [user.email]).then( function (){
        return true
      })
    }
    return false
  })
}

var userExists = function (user){
  return db.query('SELECT 1 FROM Users WHERE email=? LIMIT 1;', [user.email]).then( function (result){
    return result[0][0] !== undefined
  })
}

module.exports = {
  register: register,
  deleteUser: deleteUser
}
