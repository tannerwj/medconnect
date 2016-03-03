const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const pat = require('../src/patient')

const USERTYPE = 1

var auth = function (req, res, next){
	if (req.isAuthenticated() && req.user.userType === USERTYPE){
		return next()
	}else{
		res.sendStatus(401)
	}
}

router.post('/patient/register', function (req, res){
	var user = {
		type 	: USERTYPE,
		email : req.body.email,
		first: req.body.firstName,
		last: req.body.lastName,
		gender: req.body.gender,
		address: req.body.address,
		phone: req.body.phone,
		pass: req.body.password
	}
	pat.register(user).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/patient/edit', auth, function (req, res){
	var user = {
		id: req.user.id,
		email : req.body.email,
		first: req.body.firstName,
		last: req.body.lastName,
		blood: req.body.bloodType,
		address: req.body.address,
		phone: req.body.phone
	}
	pat.edit(user).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

module.exports = router
