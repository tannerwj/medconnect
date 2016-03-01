const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const pat = require('../src/patient')

router.get('*', function (req, res) {
	console.log('ACCESSING PATIENT ROUTES')
	res.sendFile('index.html', { root: path.join(__dirname, '../public/views') })
})

module.exports = router
