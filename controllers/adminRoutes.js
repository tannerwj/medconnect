const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const admin = require('../src/admin')

const USERTYPE = 2

var auth = function (req, res, next){
	if (req.isAuthenticated() && req.user.type === USERTYPE){
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

module.exports = router
