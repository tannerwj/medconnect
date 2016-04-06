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

router.get('/images/:image', auth, function (req, res){
  var image = req.params.image
  db.query('SELECT 1 FROM ExternalData WHERE filePath =? LIMIT 1;', [image]).then(function (result){
    if(result[0][0]){
      res.sendFile(image, { root: path.join(__dirname, '../data') })
    }else{
      res.sendStatus(401)
    }
  })
})

router.get('/images/visit/:image', auth, function (req, res){
  var image = req.params.image
  db.query('SELECT 1 FROM ExternalData WHERE filePath =? LIMIT 1;', [image]).then(function (result){
    if(result[0][0]){
      res.sendFile(image, { root: path.join(__dirname, '../data/visit') })
    }else{
      res.sendStatus(401)
    }
  })
})

module.exports = router
