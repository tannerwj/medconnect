require('dotenv').config()
const expect = require('chai').expect
const acc = require('../src/account')

describe('Test user backend', function(){
  var user = {
    email: 'test@email.com',
    pass: 'password',
    first: 'test',
    last: 'user',
    type: 0
  }
	before(function () {
    return acc.findUserByEmail(user.email).then(function (user){
      if(user){
        return acc.deleteUser(user.userID)
      }
    })
	})
	it('Create new user', function(){
		return acc.register(user).then(function (val){
			expect(val).to.not.equal(false)
		})
	})
	it('Does not create duplicate user', function(){
		return acc.register(user).then(function (val){
			expect(val).to.equal(false)
		})
	})
})
