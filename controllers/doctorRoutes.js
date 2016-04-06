const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const doc = require('../src/doctor')
const acc = require('../src/account')

var auth = function (req, res, next){
	if (req.isAuthenticated() && req.user.type === db.DOCTOR){
		return next()
	}
	res.sendStatus(401)
}

router.get('/doctor/info', auth, function (req, res){
	doc.info(req.user.id).then(function(result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/doctor/register', function (req, res){
	var user = {
		type 	: db.DOCTOR,
		email : req.body.email,
		first: req.body.first,
		last: req.body.last,
		address: req.body.address,
		phone: req.body.phone,
		pass: req.body.password,
		code: req.body.code
	}
	doc.register(user).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/doctor/edit', auth, function (req, res){
	var user = {
		id: req.user.id,
		first: req.body.firstName,
		last: req.body.lastName,
		address: req.body.address,
		phone: req.body.phone,
    exp: req.body.experience,
    volunteer: req.body.volunteerNotes,
    other: req.body.otherNotes,
    specialties: req.body.specialties,
		code: req.body.code
	}
	doc.edit(user).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/doctor/specific-doctor', function (req, res){
  var docId = req.body.id
  doc.getDoctorDetails(docId).then(function (doctor){
    if(doctor){ return res.json(doctor) }
    res.sendStatus(400)
  })
})

router.post('/doctor/getDoctor', auth, function (req, res){
	doc.getDoctor(req.user.id).then(function (result){
		if(result){	return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/doctor/changePassword', auth, function (req, res){
	acc.changePassword(req.body.newPass, req.body.curPass, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/doctor/setAvailability', auth, function (req, res){
	doc.setAvailability(req.body.data, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.get('/doctor/getCurrentAppointments', auth, function (req, res){
	doc.getCurrentAppointments(req.user.id).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/doctor/getRequestedAppointment', auth, function (req, res){
	doc.getRequestedAppointment(req.body.visitID, req.user.id).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/doctor/handleRequestedAppointment', auth, function (req, res){
	doc.handleRequestedAppointment(req.body.visitID, req.body.acceptVisit, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/doctor/getAppointmentDetail', auth, function (req, res){
	doc.getAppointmentDetail(req.body.visitID, req.user.id).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.get('/doctor/getPastPatients', auth, function (req, res){
	doc.getPastPatients(req.user.id).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/doctor/getPastAppointments', auth, function (req, res){
	doc.getPastAppointments(req.user.id, req.body.patientID).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/doctor/completeAppointment', auth, function (req, res){
	doc.completeAppointment(req.body.visitID, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/doctor/editAppointmentDetails', auth, function (req, res){
	doc.editAppointmentDetails(req.body.visitID, req.body.diagnosis, req.body.symptoms, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/doctor/addVitals', auth, function (req, res){
	doc.addVitals(req.body, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/doctor/addNote', auth, function (req, res){
	doc.addNote(req.body, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/doctor/addImage', auth, function (req, res){
	doc.addImage(req.body, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/doctor/addPrescription', auth, function (req, res){
	doc.addPrescription(req.body, req.user.id, req.user.first + ' ' + req.user.last).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

module.exports = router
