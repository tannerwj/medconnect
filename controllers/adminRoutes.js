const express = require('express')
const path = require('path')
const router = express.Router()

const db = require('../config/db')
const admin = require('../src/admin')

router.get('*', function (req, res) {
	console.log('ACCESSING ADMIN ROUTES')
	res.sendFile('index.html', { root: path.join(__dirname, '../public/views') })
})

module.exports = router
