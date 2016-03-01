const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const doc = require('../src/doctor')

router.get('*', function (req, res) {
	console.log('ACCESSING DOCTOR ROUTES')
	res.sendFile('index.html', { root: path.join(__dirname, '../public/views') })
})

router.post('/doctor/specific-doctor', function (req, res){
  var docId = req.body.id
  doc.getDoctorDetails(docId).then(function (doctor){
    if(doctor){
      req.send(doctor)
    }else{
      re.send('0')
    }
  })
})

module.exports = router
