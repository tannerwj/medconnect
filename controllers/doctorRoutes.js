const express = require('express')
const router = express.Router()

const db = require('../config/db')
const doc = require('../src/doctor')

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
