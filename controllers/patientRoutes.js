const express = require('express')
const router = express.Router()

const db = require('../config/db')
const pat = require('../src/patient')
const acc = require('../src/account')

var auth = function (req, res, next){
	if (req.isAuthenticated() && req.user.type === db.PATIENT){
		return next()
	}
	res.sendStatus(401)
}

router.get('/patient/info', auth, function (req, res){
	pat.info(req.user.id).then(function(result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/patient/register', function (req, res){
	var user = {
		type 	: db.PATIENT,
		email : req.body.email,
		first: req.body.first,
		last: req.body.last,
		gender: req.body.gender,
		address: req.body.address,
		phone: req.body.phone,
		pass: req.body.password
	}
	pat.register(user).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/patient/edit', auth, function (req, res){
	var user = {
		id: req.user.id,
		first: req.body.firstName,
		last: req.body.lastName,
		blood: req.body.bloodType,
		address: req.body.address,
		phone: req.body.phone
	}
	pat.edit(user).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.get('/patient/getDoctors', auth, function (req, res){
	pat.getDoctors().then(function(result){
		if(result){	return res.json(result)	}
		res.sendStatus(400)
	})
})

router.post('/patient/specific-doctor', auth, function (req, res){
  pat.getDoctorDetails(req.body.id).then(function (doctor){
    if(doctor){ return res.json(doctor) }
    res.sendStatus(400)
  })
})

router.post('/patient/getPatient', auth, function (req, res){
	pat.getPatient(req.user.id).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/patient/changePassword', auth, function (req, res){
	acc.changePassword(req.body.newPass, req.body.curPass, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/patient/requestAppointment', auth, function (req, res){
	pat.requestAppointment(req.user.id, req.body.doctorID, req.body.reqDate).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.get('/patient/getCurrentAppointments', auth, function (req, res){
	pat.getCurrentAppointments(req.user.id).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/patient/getAppointmentDetail', auth, function (req, res){
	pat.getAppointmentDetail(req.body.visitID, req.user.id).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.get('/patient/getPastAppointments', auth, function (req, res){
	pat.getPastAppointments(req.user.id).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

router.post('/patient/completeAppointment', auth, function (req, res){
	pat.completeAppointment(req.body.visitID, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/patient/deleteRejectedAppointment', auth, function (req, res){
	pat.deleteRejectedAppointment(req.body.visitID, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/patient/editAppointmentDetails', auth, function (req, res){
	pat.editAppointmentDetails(req.body.visitID, req.body.diagnosis, req.body.symptoms, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/patient/addVitals', auth, function (req, res){
	pat.addVitals(req.body, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/patient/addNote', auth, function (req, res){
	pat.addNote(req.body, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/patient/addImage', auth, function (req, res){
	pat.addImage(req.body, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.post('/patient/addPrescription', auth, function (req, res){
	pat.addPrescription(req.body, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

module.exports = router
