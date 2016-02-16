require('dotenv').config()
const expect = require('chai').expect
const docProf = require('../src/doctorProfile')
const acc = require('../src/account')

describe('Test doctor profile backend', function(){
  var user = {
    userId : 1,
    email	: 'test@email.com',
    pass 	: 'password',
    first 	: 'test',
    last 	: 'user',
    type : 0
  }

  var settings = {
    
  }

	before(function () {
		acc.register(user).then(function(val){
      return true
    })
	})
  it('Creates new doctor profile', function(){
    return docProf.createProfile(user).then(function (val){
      expect(val).to.equal(true)
    })
  })
  it('Does not create duplicate doctor', function(){
    return acc.register(user).then(function (val){
      expect(val).to.equal(false)
    })
  })
})
