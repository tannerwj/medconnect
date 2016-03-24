const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const pat = require('../src/patient')
const acc = require('../src/account')

const USERTYPE = 1

var auth = function (req, res, next){
	if (req.isAuthenticated() && req.user.type === USERTYPE){
		return next()
	}else{
		res.sendStatus(401)
	}
}

router.get('/patient/info', auth, function (req, res){
	pat.info(req.user.id).then(function(result){
		if(result){
			return res.json(result)
		}
		res.sendStatus(400)
	})
})

router.post('/patient/register', function (req, res){
	var user = {
		type 	: USERTYPE,
		email : req.body.email,
		first: req.body.first,
		last: req.body.last,
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

router.get('/patient/getDoctors', auth, function (req, res){
	pat.getDoctors().then(function(result){
		if(result){
			return res.json(result)
		}
	})
})

router.post('/patient/getPatient', auth, function (req, res){
	pat.getPatient(req.user.id).then(function (result){
		if(result){
			return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/patient/changePassword', auth, function (req, res){
	acc.changePassword(req.body.newPass, req.body.oldPass, req.body.currentPass, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

module.exports = router
