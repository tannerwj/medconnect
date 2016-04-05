drop procedure IF EXISTS wipe_data;
drop procedure IF EXISTS create_data;
drop procedure IF EXISTS refresh_data;

delimiter //
create procedure wipe_data()
	BEGIN
		delete from DoctorProfile;
		delete from PatientProfile;
		delete from SpecialtyDoctor;
		delete from ExternalData;
		delete from DataType;
		delete from AllergyPatient;
		delete from MedicationPatient;
		delete from Vitals;
		delete from Visits;
		delete from Specialties;
		delete from Allergies;
		delete from Medications;
		delete from Users;
	END//

create procedure create_data()
	BEGIN
		insert into Specialties(_id, name)
		values(990, 'Ophthalmology'),
			(991, 'Cardiology'),
			(992, 'OB/GYN'),
			(993, 'Urology'),
			(994, 'Dermatology'),
			(995, 'Family Medicine'),
			(996, 'Pediatrics'),
			(997, 'Oncology');

		insert into Medications(_id, name)
		values(900, 'Lipitor'),
			(901, 'Nexium'),
			(902, 'Plavix'),
			(903, 'Advair'),
			(904, 'Abilify');

		insert into DataType(_id, name)
		values(10, 'pdf'),
			(11, 'jpeg'),
			(12, 'png'),
			(13, 'docx');

		insert into Allergies(_id, name)
		values(10, 'Mold'),
			(11, 'Dust mites'),
			(12, 'Grass'),
			(13, 'Dogs'),
			(14, 'Cats');

		insert into Users(userID, userType, email, lastName, firstName, password)
		values(990, 0, 'test0@test.com', 'Test0', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(991, 0, 'test1@test.com', 'Test1', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(992, 0, 'test2@test.com', 'Test2', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(993, 0, 'test3@test.com', 'Test3', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(994, 0, 'test4@test.com', 'Test4', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(995, 1, 'patient1@patient.com', 'Test5', 'Patient', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(996, 1, 'patient2@patient.com', 'Test6', 'Patient', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(997, 1, 'patient3@patient.com', 'Test7', 'Patient', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(998, 1, 'patient4@patient.com', 'Test8', 'Patient', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(999, 2, 'admin1@admin.com', 'Test9', 'Admin', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(1000, 2, 'admin2@admin.com', 'Test10', 'Admin', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(1001, 2, 'admin3@admin.com', 'Test11', 'Admin', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(1002, 2, 'admin4@admin.com', 'Test12', 'Admin', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG');

		insert into PatientProfile(userID, gender, bloodType, address, phone)
		values(995, 'M', 'A+', '123 Patient St.', '111-222-3333'),
			(996, 'F', 'O-', '456 Patient St.', '111-222-3333'),
			(997, 'F', 'AB', '789 Patient St.', '111-222-3333'),
			(998, 'M', 'O', '013 Patient St.', '111-222-3333');

		insert into DoctorProfile(userID, address, phone, verified, verificationCode, experience, volunteerNotes, otherNotes)
		values(990, '123 Test St., Provo, UT 84601', '111-222-3333', -1, 'asdfhqwrasfhiw239823ry', '8 years', 'Awesome', 'other notes'),
			(991, '123 Test St., Provo, UT 84601', '111-222-3333', 0, '1348eqf134fof8gewqfq3o8', '7 years', 'Awesome', 'other notes'),
			(992, '123 Test St., Provo, UT 84601', '111-222-3333', 0, '2q38r919fefq3pfh34fqfff', '2 years', 'Awesome', 'other notes'),
			(993, '123 Test St., Provo, UT 84601', '111-222-3333', 1, 'q394fqdiqanwefiuhqw239f', '3 years', 'Awesome', 'other notes'),
			(994, '123 Test St., Provo, UT 84601', '111-222-3333', 1, '134r9fqf3h4f9843fhf8qoq', '80 years', 'Awesome', 'other notes');

		insert into AllergyPatient(allergyID, userID)
		values(10, 995),
			(14, 995),
			(12, 997);

		insert into Visits(visitID, visitStatus, patientID, doctorID, visitDate, diagnosis, symptoms)
		values(899, 1, 995, 990, '2015-02-01 12:00:00', '', 'Looks healthy'),
			(900, 1, 995, 990, '2015-08-04 13:15:00', 'pains in stomach', 'no more buffets, please'),
			(901, 1, 995, 990, '2015-10-21 09:00:00', 'pains in stomach', 'eat less'),
			(902, 1, 996, 993, '2015-04-13 14:20:00', 'too skinny', 'eat more'),
			(903, 1, 996, 992, '2015-12-01 08:00:00', 'large, spiked hair', 'turn down the music'),
			(904, 1, 996, 990, '2016-01-05 13:45:00', 'pains in stomach', 'stop eating'),
			(905, 1, 996, 991, '2016-03-20 15:15:00', '', 'Looks healthy'),
			(906, 1, 997, 993, '2015-01-31 11:00:00', 'in shape, fatigue', 'stop running when you black out'),
			(907, 1, 997, 994, '2015-02-15 11:15:00', 'sunburnt, headaches', 'sunscreen?'),
			(908, 1, 997, 992, '2015-06-01 09:30:00', '', 'Looks healthy'),
			(909, 1, 997, 990, '2015-10-30 11:15:00', 'Check-up (follow up)', 'Looks healthy'),
			(910, 1, 997, 993, '2016-01-07 12:15:00', 'punk rocker', 'teenager'),
			(911, 1, 997, 991, '2015-03-03 16:45:00', 'large fangs', 'Get garlic necklace'),
			(912, 1, 997, 994, '2015-03-21 09:15:00', 'child-like behavior', 'Waste of time'),
			(913, 1, 998, 993, '2015-02-13 08:45:00', '', 'Looks healthy'),
			(914, 1, 998, 991, '2015-08-19 09:45:00', '', 'Looks healthy'),
			(915, 1, 998, 993, '2016-01-26 13:00:00', 'coughing, bad breath', 'no comments'),
			(916, 1, 998, 992, '2016-02-28 11:15:00', 'coughing, bad breath', 'no comments');

		insert into Vitals(userID, visitID, vitalsDate, height, weight, BMI, temperature, pulse, respiratoryRate, bloodPressure, bloodOxygenSat)
		values(995, 899, '2015-02-01 12:00:00', '5\'10\"', '164', '23', '98.7', '110', '18', '120/80', '98%'),
			(995, 900, '2015-08-04 13:15:00', '5\'10\"', '164', '23', '98.7', '115', '17', '120/80', '98%'),
			(995, 901, '2015-10-21 09:00:00', '5\'10\"', '164', '23', '98.7', '112', '18', '120/80', '98%'),
			(996, 902, '2015-04-13 14:20:00', '5\'08\"', '172', '26', '98.7', '110', '13', '128/80', '96%'),
			(996, 903, '2015-12-01 08:00:00', '5\'08\"', '172', '26', '98.7', '113', '16', '125/80', '97%'),
			(996, 904, '2016-01-05 13:45:00', '5\'08\"', '172', '26', '98.7', '118', '17', '124/80', '98%'),
			(996, 905, '2016-03-20 15:15:00', '5\'08\"', '172', '26', '98.7', '110', '15', '123/80', '94%'),
			(997, 906, '2015-01-31 11:00:00', '5\'04\"', '132', '22', '98.7', '111', '14', '122/80', '98%'),
			(997, 907, '2015-02-15 11:15:00', '5\'04\"', '132', '22', '98.7', '120', '15', '121/80', '98%'),
			(997, 908, '2015-06-01 09:30:00', '5\'04\"', '132', '22', '98.7', '130', '16', '123/80', '98%'),
			(997, 909, '2015-10-30 11:15:00', '5\'04\"', '132', '22', '98.7', '123', '13', '121/80', '97%'),
			(997, 910, '2016-01-07 12:15:00', '5\'05\"', '132', '22', '98.7', '124', '14', '120/80', '98%'),
			(997, 911, '2015-03-03 16:45:00', '5\'05\"', '132', '22', '98.7', '130', '14', '122/80', '96%'),
			(997, 912, '2015-03-21 09:15:00', '5\'05\"', '132', '22', '98.7', '110', '15', '123/80', '98%'),
			(998, 913, '2015-02-13 08:45:00', '5\'03\"', '190', '30', '98.7', '90', '23', '130/80', '79%'),
			(998, 914, '2015-08-19 09:45:00', '5\'03\"', '190', '30', '98.7', '98', '22', '129/80', '78%'),
			(998, 915, '2016-01-26 13:00:00', '5\'03\"', '190', '30', '98.7', '130', '24', '128/80', '76%'),
			(998, 916, '2016-02-28 11:15:00', '5\'03\"', '190', '30', '98.7', '122', '23', '131/80', '78%');

		insert into SpecialtyDoctor(specialtyID, doctorID)
		values(991, 991),
			(991, 992),
			(991, 993),
			(992, 994),
			(993, 994),
			(994, 992),
			(996, 992),
			(996, 993);

		insert into MedicationPatient(medicationID, userID, visitID, dosage, startDate, stopDate, notes, doctorID, doctorName)
		values(900, 995, 899, '20 mL', '2015-02-01 00:00:00', '2015-02-28 00:00:00', 'once daily', 990, 'Doctor Test0'),
			(903, 997, 906, '20 mG', '2015-01-31 00:00:00', '2015-02-13 00:00:00', 'twice daily', 993, 'Doctor Test3'),
			(904, 998, 916, '13 mL', '2016-02-28 00:00:00', '2016-04-28 00:00:00', 'once daily with food', 992, 'Doctor Test2');

		insert into ExternalData(dataID, userID, visitID, dataTypeID, filePath, dataName, uploadDate)
		values(1, 991, 905, 10, '/path/to/file', 'Visit Record', '2016-03-20 15:15:00'),
			(2, 992, 903, 11, '/path/to/file', 'Full workup', '2015-12-01 08:00:00'),
			(3, 991, 911, 13, '/path/to/file', 'Visit Document', '2015-03-03 16:45:00'),
			(4, 993, 915, 10, '/path/to/file', 'Vitals doc', '2016-01-26 13:00:00');

		END//

create procedure refresh_data()
	BEGIN
		call wipe_data;
		call create_data;
	END//
delimiter ;
