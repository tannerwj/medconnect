require('dotenv').config()
const expect = require('chai').expect
const acc = require('../src/account')
const doc = require('../src/doctor')

describe('Test doctor backend', function(){
  var user = {
    email: 'doctortest@email.com',
    first: 'test',
    last: 'user',
    address: 'test address',
    phone: '9876544321',
    pass: 'password',
    code: '1234567',
    type: 0
  }
  var editUser = {
    email: 'doctortest@email.com',
    last: 'newLast',
    first: 'newFirst',
    address: 'new address',
    phone: '1234566789',
    exp: 'lots',
    volunteer: 'not much',
    code: '1234567',
    other: 'none'
  }
	before(function () {
    return acc.findUserByEmail(user.email).then(function (user){
      if(user){
        return doc.deleteDoctor(user.userID)
      }
    })
	})
	it('Create new doctor', function(){
		return doc.register(user).then(function (val){
			expect(val).to.not.equal(false)
		})
	})
	it('Does not create duplicate doctor', function(){
		return doc.register(user).then(function (val){
			expect(val).to.equal(false)
		})
	})
	it('Edits doctor', function(){
    return acc.findUserByEmail(editUser.email).then(function (user){
      if(user){
        editUser.id = user.userID
        return doc.edit(editUser).then(function (val){
    			expect(val).to.equal(true)
    		})
      }
    })
	})
})
