require('dotenv').config()
const expect = require('chai').expect
const acc = require('../src/account')
const pat = require('../src/patient')

describe('Test patient backend', function(){
  var user = {
    email: 'patienttest@email.com',
    first: 'test',
    last: 'user',
    gender: 'm',
    address: 'test address',
    phone: '9876544321',
    pass: 'password',
    type: 1
  }
  var editUser = {
    email: 'patienttest@email.com',
    last: 'newLast',
    first: 'newFirst',
    blood: 'new',
    address: 'new address',
    phone: '1234566789'
  }
	before(function () {
    return acc.findUserByEmail(user.email).then(function (user){
      if(user){
        return pat.deletePatient(user.userID)
      }
    })
	})
	it('Create new patient', function(){
		return pat.register(user).then(function (val){
			expect(val).to.not.equal(false)
		})
	})
	it('Does not create duplicate patient', function(){
		return pat.register(user).then(function (val){
			expect(val).to.equal(false)
		})
	})
	it('Edits patient', function(){
    return acc.findUserByEmail(editUser.email).then(function (user){
      if(user){
        editUser.id = user.userID
        return pat.edit(editUser).then(function (val){
    			expect(val).to.equal(true)
    		})
      }
    })
	})
})
