const express 	= require('express')
const path 		= require('path')
const passport 	= require('passport')

const router = express.Router()

const db = require('../config/db')

const BCRYPT_ROUNDS = 13

router.get('/', function (req, res) { 
	res.sendFile('index.html', { root: path.join(__dirname, '../views') }) 
})

router.get('/loggedin', function (req, res) {
	res.send(req.isAuthenticated() ? req.user : '0')
})

router.post('/login', function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err) { return next(err) }
		if (!user) {
			return res.send('invalid')
		}
		if (user.verified === 0){
			return res.send('unverified')
		}
		req.logIn(user, function (err) {
			if (err) { return next(err) }
			return res.send(req.user)
		})
	})(req, res, next)
})

router.post('/register', function(req, res) {
	var user = { 
		email	: req.body.email,
		type 	: req.body.type,
		pass 	: req.body.pass,
		first 	: req.body.first,
		last 	: req.body.last
	}

	db.query('SELECT 1 FROM Users WHERE email=? LIMIT 1;', [user.email]).then( function (result){
		if(result[0][0]){
			res.send('0')
		}else{
			return bcrypt.hash(user.pass, BCRYPT_ROUNDS, function (err, hash) {
				return db.query('INSERT INTO Users (userType, email, lastName, firstName, password) VALUES (?,?,?,?,?);', [user.type, user.email, user.first, user.last, hash]).then( function (result){
					user.user_id = result[0].insertId
					res.send('2')
				})
			})
		}
	}).catch( function (err){
		console.error(err)
	}).done()
})

router.get('/logout', function (req, res){
	if(req.user){ req.logout() }
	res.redirect('/')
})

router.get('*', function (req, res) {
	//catch all other requests
	res.sendFile('index.html', { root: path.join(__dirname, '../views') })
})

module.exports = router