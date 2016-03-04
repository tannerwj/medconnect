const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const doc = require('../src/doctor')

const USERTYPE = 0

var auth = function (req, res, next){
	if (req.isAuthenticated() && req.user.userType === USERTYPE){
		return next()
	}else{
		res.sendStatus(401)
	}
}

router.post('/doctor/register', function (req, res){
	var user = {
		type 	: USERTYPE,
		email : req.body.email,
		first: req.body.firstName,
		last: req.body.lastName,
		address: req.body.address,
		phone: req.body.phone,
		pass: req.body.password,
		code: req.body.code
	}
	doc.register(user).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/doctor/edit', auth, function (req, res){
	var user = {
		id: req.user.id,
		email : req.body.email,
		first: req.body.firstName,
		last: req.body.lastName,
		address: req.body.address,
		phone: req.body.phone,
    exp: req.body.experience,
    volunteer: req.body.volunteerNotes,
    other: req.body.otherNotes
	}
	doc.edit(user).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/doctor/specific-doctor', auth, function (req, res){
  var docId = req.body.id
  doc.getDoctorDetails(docId).then(function (doctor){
    if(doctor){
      res.send(doctor)
    }else{
      res.sendStatus(400)
    }
  })
})

module.exports = router
