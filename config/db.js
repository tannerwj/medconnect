var database = require('mysql-promise')()

database.configure({
	'host': process.env.DB_HOST,
	'user': process.env.DB_USER,
	'password': process.env.DB_PASSWORD,
	'database': process.env.DB_DATABASE || 'medconnect'
})

database.REQUESTED_VISIT = 1
database.REJECTED_VISIT = 2
database.ACCEPTED_VISIT = 3
database.COMPLETED_VISIT = 4

database.DOCTOR = 0
database.PATIENT = 1
database.ADMIN = 2

database.MAX_FILE_SIZE = 5000000 //bytes

database.DOCTOR_UNVERIFIED = 0
database.DOCTOR_DENIED = -1
database.DOCTOR_VERIFIED = 1

module.exports = database
