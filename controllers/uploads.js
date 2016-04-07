const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')

var auth = function (req, res, next){
	if (req.isAuthenticated() && (req.user.type === db.DOCTOR || req.user.type === db.PATIENT)){
		return next()
	}
	res.sendStatus(401)
}

router.get('/uploads/patient/:upload', auth, function (req, res){
  var upload = req.params.upload
  db.query('SELECT 1 FROM ExternalData WHERE fileName =? AND patientID =? LIMIT 1;', [upload, req.user.id]).then(function (result){
    if(result[0][0]){
      return res.sendFile(upload, { root: path.join(__dirname, '../data/patient') })
    }
    res.sendStatus(401)
  })
})

router.get('/uploads/visit/:upload', auth, function (req, res){
  var upload = req.params.upload
  db.query('SELECT 1 FROM ExternalData WHERE fileName =? AND (patientID =? OR doctorID =?) LIMIT 1;', [upload, req.user.id, req.user.id]).then(function (result){
    if(result[0][0]){
      return res.sendFile(upload, { root: path.join(__dirname, '../data/visit') })
    }
    res.sendStatus(401)
  })
})

module.exports = router
