const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const data = require('../src/data')

var auth = function (req, res, next){
	if (req.isAuthenticated() && (req.user.type === db.DOCTOR || req.user.type === db.PATIENT)){
		return next()
	}else{
		res.sendStatus(401)
	}
}

router.post('/data/getStatic', auth, function (req, res){
	data.getData(req.body.type).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

module.exports = router
