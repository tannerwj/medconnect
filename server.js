var express		= require('express')
var http 		= require('http')
var https		= require('https')
var bodyParser	= require('body-parser')
var cookieParser = require('cookie-parser')
var favicon 	= require('serve-favicon')
var bcrypt 		= require('bcryptjs')
var session 	= require('express-session')
var Q			= require('q')
var async		= require('async-q')
var app			= express()

var port = process.env.PORT || 80

app.disable('x-powered-by')
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))

http.createServer(app).listen(port, function (){
	console.log('SERVER STARTED ' + port)
})
