const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const doc = require('../src/doctor')

const USERTYPE = 0

router.post('/doctor/specific-doctor', auth, function (req, res){
  var docId = req.body.id
  doc.getDoctorDetails(docId).then(function (doctor){
    if(doctor){
      res.send(doctor)
    }else{
      res.send('0')
    }
  })
})

var auth = function (req, res, next){
	if (req.isAuthenticated() && req.user.userType === USERTYPE){
		return next()
	}else{
		res.sendStatus(401)
	}
}

module.exports = router
