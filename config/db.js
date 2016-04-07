var database = require('mysql-promise')()

database.configure({
	'host': process.env.DB_HOST,
	'user': process.env.DB_USER,
	'password': process.env.DB_PASSWORD,
	'database': 'medconnect'
})

database.REQUESTED_VISIT = 1
database.REJECTED_VISIT = 2
database.ACCEPTED_VISIT = 3
database.COMPLETED_VISIT = 4

database.DOCTOR = 0
database.PATIENT = 1
database.ADMIN = 2

database.MAX_FILE_SIZE = 5000000 //bytes

database.escape = function (str) {
	return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
		switch (char) {
			case "\0":
				return "\\0";
			case "\x08":
				return "\\b";
			case "\x09":
				return "\\t";
			case "\x1a":
				return "\\z";
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "\"":
			case "'":
			case "\\":
			case "%":
				return "\\"+char;
		}
	})
}

module.exports = database
