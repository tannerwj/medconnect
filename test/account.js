require('dotenv').config()
const expect = require('chai').expect
const acc = require('../src/account')

describe('Test patient backend', function(){
  var user = {
    email	: 'test@email.com',
    pass 	: 'password',
    first 	: 'test',
    last 	: 'user',
    type : 1
  }
	before(function () {
		return acc.deleteUser(user)
	})
	it('Create new patient', function(){
		return acc.register(user).then(function (val){
			expect(val).to.equal(true)
		})
	})
	it('Does not create duplicate patient', function(){
		return acc.register(user).then(function (val){
			expect(val).to.equal(false)
		})
	})
})

describe('Test doctor backend', function(){
  var user = {
    email	: 'test@email.com',
    pass 	: 'password',
    first 	: 'test',
    last 	: 'user',
    type : 0
  }
	before(function () {
		return acc.deleteUser(user)
	})
  it('Create new doctor', function(){
    return acc.register(user).then(function (val){
      expect(val).to.equal(true)
    })
  })
  it('Does not create duplicate doctor', function(){
    return acc.register(user).then(function (val){
      expect(val).to.equal(false)
    })
  })
})
