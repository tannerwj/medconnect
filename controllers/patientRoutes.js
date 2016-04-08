const express = require('express')
const multer  = require('multer')
const mime = require('mime')
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

router.post('/patient/updateRejectedAppointment', auth, function (req, res){
	pat.updateRejectedAppointment(req.body.visitDate, req.body.visitID, req.user.id).then(function (result){
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

router.get('/patient/getVitals', auth, function(req, res){
	pat.getVitals(req.user.id).then(function(result){
		if(result){return res.json(result)}
		return res.sendStatus(400)
	})
})

router.post('/patient/addNote', auth, function (req, res){
	pat.addNote(req.body, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.get('/patient/getNotes', auth, function(req, res){
	pat.getNotes(req.user.id).then(function(result){
		if(result){return res.json(result)}
		return res.sendStatus(400)
	})
})

router.post('/patient/removeNote', auth, function (req, res){
	pat.removeNote(req.body.noteID, req.user.id).then(function (result){
		if(result){ return res.json(result) }
		res.sendStatus(400)
	})
})

var allowedTypes = ['image/png', 'image/jpeg', 'image/gif']
var storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, './data/tmp/')
  },
  filename: function (req, file, cb){
		cb(null, req.user.id + '-' + Date.now() + '.' + mime.extension(file.mimetype))
  }
})
var upload = multer({
		storage: storage,
		limits: {
			fileSize: db.MAX_FILE_SIZE
		},
		fileFilter: function (req, file, cb){
			//only allow allowed mime types
			if(!!~allowedTypes.indexOf(file.mimetype)){
				cb(null, true)
			}else{
				cb('mime type not allowed')
			}
		}
}).single('file')

router.post('/patient/addFile', auth, function(req, res) {
  upload(req, res, function(err){
      if(err){ return res.status(400).end(err) }
			pat.addFile(req.body, req.user.id, req.file).then(function (result){
				if(result){ return res.json(result) }
				res.sendStatus(400)
			})
  })
})

router.post('/patient/addPrescription', auth, function (req, res){
	pat.addPrescription(req.body, req.user.id).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

router.get('/patient/getPrescriptions', auth, function(req, res){
	pat.getPrescriptions(req.user.id).then(function(results){
		if(results){
			return res.json(results)
		}
		return res.sendStatus(400)
	})
})

router.post('/patient/removePrescription', auth, function (req, res){
	pat.removePrescription(req.body.medicationID, req.user.id, req.body.visitID).then(function (result){
		res.sendStatus(result ? 200 : 400)
	})
})

module.exports = router
