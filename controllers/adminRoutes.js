const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const admin = require('../src/admin')

const USERTYPE = 2

var auth = function (req, res, next){
	if (req.isAuthenticated() && req.user.userType === USERTYPE){
		return next()
	}else{
		res.sendStatus(401)
	}
}

module.exports = router
