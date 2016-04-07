const express = require('express')
const router = express.Router()

const db = require('../config/db')

var auth = function (req, res, next){
	if (req.isAuthenticated() && (req.user.type === db.DOCTOR || req.user.type === db.PATIENT)){
		return next()
	}else{
		res.sendStatus(401)
	}
}

router.get('/uploads/:upload', auth, function (req, res){
  var upload = req.params.upload
  db.query('SELECT 1 FROM ExternalData WHERE filePath =? AND (patientID =? OR doctorID =?) LIMIT 1;', [upload, req.user.id, req.user.id]).then(function (result){
    if(result[0][0]){
      res.sendFile(image, { root: path.join(__dirname, '../data') })
    }else{
      res.sendStatus(401)
    }
  })
})

router.get('/uploads/visit/:upload', auth, function (req, res){
  var upload = req.params.upload
  db.query('SELECT 1 FROM ExternalData WHERE filePath =? AND (patientID =? OR doctorID =?) LIMIT 1;', [upload, req.user.id, req.user.id]).then(function (result){
    if(result[0][0]){
      res.sendFile(upload, { root: path.join(__dirname, '../data/visit') })
    }else{
      res.sendStatus(401)
    }
  })
})

module.exports = router
