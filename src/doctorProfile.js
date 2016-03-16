const db = require('../config/db')

var createProfile = function (user, settings){
  return profileExists(user).then( function (exists){
    if(!exists){
			return new Promise( function (resolve, reject){
        //check if location already exists
          //if not exists, create a location
          //grab the locationId




        var query = '';
        var values = '';
        for(var key in settings){
          if (!settings.hasOwnProperty(key)) continue;
          query += ', ' + key
          values += ', ' + settings[key]
        }
        return resolve(db.query('INSERT INTO DoctorProfile (userId' + query + ') VALUES (' + user.userId + values + ');').then( function (result){
        	return true
        }))
      })
		}
    return false
	})
}

var updateProfile = function (user, settings){
  return profileExists(user).then( function (exists){
    if(exists){
      return new Promise( function (resolve, reject){
        var query = 'UPDATE DoctorProfile set ';
        for(var key in settings){
          if (!settings.hasOwnProperty(key)) continue;
          query += key + ' = ' + settings[key] + ', '
        }
        query = query.substring(0, query.length - 2) + ' where userId = ' + user.userId + ';';
        console.log(query)
        return resolve(db.query(query).then( function (result){
          return true
        }))
      })
    }
    return false
  })
}

var profileExists = function (user){
  return db.query('SELECT 1 FROM DoctorProfile WHERE userId=? LIMIT 1;', [user.userId]).then( function (result){
    return result[0][0] !== undefined
  })
}

module.exports = {
  createProfile: createProfile,
  updateProfile: updateProfile
}
