const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const admin = require('../src/admin')
const account = require('../src/account')

const USERTYPE = 2

var auth = function (req, res, next){
	if (req.isAuthenticated() && req.user.userType === USERTYPE){
		return next()
	}
	res.sendStatus(401)	
}

router.post('/admin/add', auth, function (req, res){
	admin.add(req.body.type, req.body.data).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/admin/view', auth, function (req, res){
	admin.view(req.body.type).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/admin/edit', auth, function (req, res){
	admin.edit(req.body.type, req.body.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/admin/deactivate', auth, function (req, res){
	admin.deactivate(req.body.type, req.body.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/admin/activate', auth, function (req, res){
	admin.activate(req.body.type, req.body.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/admin/delete', auth, function (req, res){
	admin.delete(req.body.type, req.body.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/admin/viewAdmins', auth, function (req, res){
	admin.viewAdmins(req.body.type, req.user.id).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/admin/createAdmin', auth, function (req, res){
	var user = {
		type: 2,
		first: req.body.data.firstName,
		last: req.body.data.lastName,
		email: req.body.data.email,
		pass: req.body.data.password
	}
	account.register(user).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/admin/deleteAdmin', auth, function (req, res){
	account.deleteUser(req.body.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

module.exports = router
