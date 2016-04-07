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
		values(1, 'Abilify'),
			(2, 'Nexium'),
			(3, 'Humira'),
			(4, 'Crestor'),
			(5, 'Advair Diskus'),
			(6, 'Enbrel'),
			(7, 'Remicade'),
			(8, 'Cymbalta'),
			(9, 'Copaxone'),
			(10, 'Neulasta'),
			(11, 'Lantus Solostar'),
			(12, 'Rituxan'),
			(13, 'Spiriva Handihaler'),
			(14, 'Januvia'),
			(15, 'Atripla'),
			(16, 'Lantus'),
			(17, 'Avastin'),
			(18, 'Lyrica'),
			(19, 'Oxycontin'),
			(20, 'Epogen'),
			(21, 'Celebrex'),
			(22, 'Truvada'),
			(23, 'Diovan'),
			(24, 'Gleevec'),
			(25, 'Herceptin'),
			(26, 'Lucentis'),
			(27, 'Namenda'),
			(28, 'Vyvanse'),
			(29, 'Zetia'),
			(30, 'Levemir'),
			(31, 'Symbicort'),
			(32, 'Sovaldi'),
			(33, 'Novolog Flexpen'),
			(34, 'Novolog'),
			(35, 'Tecfidera'),
			(36, 'Suboxone'),
			(37, 'Humalog'),
			(38, 'Xarelto'),
			(39, 'Seroquel XR');

		insert into DataType(_id, name)
		values(10, 'MRI'),
			(11, 'XRAY'),
			(12, 'Test Results'),
			(13, 'Other Scans'),
			(14, 'Exam');

		insert into Allergies(_id, name)
		values(10, 'Mold'),
			(11, 'Dust mites'),
			(12, 'Grass'),
			(13, 'Dogs'),
			(14, 'Cats');

		insert into Users(userID, userType, email, lastName, firstName, password)
		values(990, 0, 'doctor0@doctor.com', 'Omri', 'Gavin', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(991, 0, 'doctor1@doctor.com', 'Abner', 'Baldassare', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(992, 0, 'doctor2@doctor.com', 'Sigge', 'Dagrun', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(993, 0, 'doctor3@doctor.com', 'Aleksandre', 'Argi', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(994, 0, 'doctor4@doctor.com', 'Jordana', 'Maolshea', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(995, 1, 'patient1@patient.com', 'Gwil', 'Stane', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(996, 1, 'patient2@patient.com', 'Anapa', 'Terell', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(997, 1, 'patient3@patient.com', 'Konstancja', 'Beverly', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(998, 1, 'patient4@patient.com', 'Gisilbert', 'Bogdan', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(999, 2, 'admin1@admin.com', 'Hallbjörn', 'Tsveta', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(1000, 2, 'admin2@admin.com', 'Shikoba', 'Gulrukh', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(1001, 2, 'admin3@admin.com', 'Tsvetanka', 'Trendafilka', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(1002, 2, 'admin4@admin.com', 'Viviane', 'Corina', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG');

		insert into PatientProfile(userID, gender, bloodType, address, phone)
		values(995, 'M', 'A+', 'Chhetrapati, Thamel, 44600, Nepal', '97714285922'),
			(996, 'F', 'O-', '619 Chaksibari Marg, Thamel, Nepal', '97714913884'),
			(997, 'F', 'AB', '230 hotel marg lazimpat kathmandu nepal, 9771', '97714255977'),
			(998, 'M', 'O', '59 Z Street Thamel, Nepal', '97714249735');

		insert into DoctorProfile(userID, address, phone, verified, verificationCode, experience, volunteerNotes, otherNotes, availability)
		values(990, 'Bansbari, Hattigaunda, 981, Nepal', '97714913884', -1, 'asdfhqwrasfhiw239823ry', '8 years', '3 months working at clinic in Karaputar', 'Prefer to treat entire family', '[["Monday","2016-04-07T14:00:08.835Z","2016-04-08T00:00:08.835Z"],["Tuesday","2016-04-07T15:00:08.835Z","2016-04-08T03:00:08.835Z"],["Wednesday","2016-04-07T14:00:08.835Z","2016-04-07T23:00:08.835Z"],["Thursday","2016-04-07T16:00:08.835Z","2016-04-08T01:00:08.835Z"],["Friday","2016-04-07T06:00:08.835Z","2016-04-07T06:00:08.835Z"],["Saturday","unavaliable","unavaliable"],["Sunday","unavaliable","unavaliable"]]'),
			(991, 'Bouddha, 44600, Nepal', '97714285922', 0, '1348eqf134fof8gewqfq3o8', '7 years', 'Every Saturday I provide free in-home consultations', 'Looking for new patients', '[["Monday","2016-04-07T14:00:08.835Z","2016-04-08T00:00:08.835Z"],["Tuesday","2016-04-07T15:00:08.835Z","2016-04-08T03:00:08.835Z"],["Wednesday","2016-04-07T14:00:08.835Z","2016-04-07T23:00:08.835Z"],["Thursday","2016-04-07T16:00:08.835Z","2016-04-08T01:00:08.835Z"],["Friday","2016-04-07T06:00:08.835Z","2016-04-07T06:00:08.835Z"],["Saturday","unavaliable","unavaliable"],["Sunday","unavaliable","unavaliable"]]'),
			(992, 'Swayambhu, West Ring Road, Buddha Park, Nepal', '97714262986', 0, '2q38r919fefq3pfh34fqfff', '2 years', '', 'Unable to accept new patients', '[["Monday","2016-04-07T14:00:08.835Z","2016-04-08T00:00:08.835Z"],["Tuesday","2016-04-07T15:00:08.835Z","2016-04-08T03:00:08.835Z"],["Wednesday","2016-04-07T14:00:08.835Z","2016-04-07T23:00:08.835Z"],["Thursday","2016-04-07T16:00:08.835Z","2016-04-08T01:00:08.835Z"],["Friday","2016-04-07T06:00:08.835Z","2016-04-07T06:00:08.835Z"],["Saturday","unavaliable","unavaliable"],["Sunday","unavaliable","unavaliable"]]'),
			(993, 'Chibahal,Thamel, 44600, Nepal', '97714249735', 1, 'q394fqdiqanwefiuhqw239f', '3 years', '2 trips to India as researcher', 'Searching to increase patient numbers', '[["Monday","2016-04-07T14:00:08.835Z","2016-04-08T00:00:08.835Z"],["Tuesday","2016-04-07T15:00:08.835Z","2016-04-08T03:00:08.835Z"],["Wednesday","2016-04-07T14:00:08.835Z","2016-04-07T23:00:08.835Z"],["Thursday","2016-04-07T16:00:08.835Z","2016-04-08T01:00:08.835Z"],["Friday","2016-04-07T06:00:08.835Z","2016-04-07T06:00:08.835Z"],["Saturday","unavaliable","unavaliable"],["Sunday","unavaliable","unavaliable"]]'),
			(994, 'P road,Thamel, 44600, Nepal', '97714255977', 1, '134r9fqf3h4f9843fhf8qoq', '15 years', '4 doctor abroad trips through VolunteerForever', 'Looking for new patients', '[["Monday","2016-04-07T14:00:08.835Z","2016-04-08T00:00:08.835Z"],["Tuesday","2016-04-07T15:00:08.835Z","2016-04-08T03:00:08.835Z"],["Wednesday","2016-04-07T14:00:08.835Z","2016-04-07T23:00:08.835Z"],["Thursday","2016-04-07T16:00:08.835Z","2016-04-08T01:00:08.835Z"],["Friday","2016-04-07T06:00:08.835Z","2016-04-07T06:00:08.835Z"],["Saturday","unavaliable","unavaliable"],["Sunday","unavaliable","unavaliable"]]');

		insert into AllergyPatient(allergyID, userID)
		values(10, 995),
			(14, 995),
			(12, 997);

		insert into Visits(visitID, visitStatus, patientID, doctorID, visitDate, diagnosis, symptoms)
		values(899, 1, 995, 990, '2015-02-01 12:00:00', '', 'Looks healthy'),
			(900, 1, 995, 990, '2015-08-04 13:15:00', 'pains in stomach', 'no more buffets, please'),
			(901, 1, 995, 990, '2015-10-21 09:00:00', 'pains in stomach', 'eat less'),
			(906, 2, 997, 993, '2015-01-31 11:00:00', 'in shape, fatigue', 'stop running when you black out'),
			(907, 2, 997, 994, '2015-02-15 11:15:00', 'sunburnt, headaches', 'sunscreen?'),
			(908, 3, 997, 992, '2015-06-01 09:30:00', '', 'Looks healthy'),
			(909, 3, 997, 990, '2015-10-30 11:15:00', 'Check-up (follow up)', 'Looks healthy'),
			(910, 3, 997, 993, '2016-01-07 12:15:00', 'punk rocker', 'teenager'),
			(911, 4, 997, 991, '2015-03-03 16:45:00', 'large fangs', 'Get garlic necklace'),
			(912, 4, 997, 994, '2015-03-21 09:15:00', 'child-like behavior', 'Waste of time'),
			(913, 4, 998, 993, '2015-02-13 08:45:00', '', 'Looks healthy'),
			(914, 4, 998, 991, '2015-08-19 09:45:00', '', 'Looks healthy'),
			(915, 4, 998, 993, '2016-01-26 13:00:00', 'coughing, bad breath', 'no comments'),
			(902, 4, 996, 991, '2012-04-13 14:20:00', 'Acute Pleurodynia', 'Complaining of chest pain and difficulty breathing'),
			(903, 4, 996, 991, '2012-12-01 08:00:00', 'Follow-up visit', 'Follow-up for visit 8 months ago'),
			(904, 4, 996, 991, '2014-01-05 13:45:00', 'Acute Pleurodynia', 'Yearly checkup; no symptoms'),
			(905, 4, 996, 991, '2014-03-20 15:15:00', 'Acute Pleurodynia', 'Additional chest pain; dizziness'),
			(1011, 4, 996, 991, '2014-08-12 15:15:00', 'Acute Pleurodynia', 'Follow-up visit; no symptoms;'),
			(1234, 4, 996, 991, '2015-02-28 15:15:00', 'none', 'Yearly checkup; no symptoms'),
			(1111, 4, 998, 991, '2015-08-19 09:45:00', '', 'Looks healthy'),
			(112, 1, 995, 991, '2015-09-10 09:30:00', '', 'Looks healthy'),
			(113, 1, 997, 991, '2015-10-13 09:15:00', '', 'Looks healthy'),
			(114, 2, 998, 991, '2015-08-17 08:45:00', '', 'Looks healthy'),
			(115, 2, 995, 991, '2016-03-11 10:45:00', '', 'Looks healthy'),
			(116, 3, 998, 991, '2015-06-09 09:30:00', '', 'Looks healthy'),
			(117, 3, 997, 991, '2016-02-13 16:45:00', '', 'Looks healthy'),
			(118, 3, 998, 991, '2015-08-19 12:15:00', '', 'Looks healthy'),
			(122, 3, 995, 991, '2015-09-20 13:00:00', '', 'Looks healthy'),
			(123, 3, 998, 991, '2015-01-28 13:45:00', '', 'Looks healthy'),
			(124, 3, 997, 991, '2016-02-04 15:30:00', '', 'Looks healthy'),
			(125, 3, 997, 991, '2015-02-03 17:15:00', '', 'Looks healthy'),
			(126, 4, 998, 991, '2015-07-19 19:30:00', '', 'Looks healthy'),
			(127, 4, 995, 991, '2015-10-05 08:30:00', '', 'Looks healthy'),
			(128, 4, 998, 991, '2015-11-19 09:00:00', '', 'Looks healthy'),
			(132, 4, 997, 991, '2015-08-14 14:30:00', '', 'Looks healthy'),
			(133, 4, 998, 991, '2015-09-17 13:30:00', '', 'Looks healthy'),
			(134, 4, 997, 991, '2015-02-20 17:30:00', '', 'Looks healthy'),
			(135, 4, 998, 991, '2015-05-26 15:00:00', '', 'Looks healthy'),
			(136, 4, 995, 991, '2016-01-01 12:30:00', '', 'Looks healthy'),
			(137, 4, 997, 991, '2015-07-03 09:30:00', '', 'Looks healthy'),
			(138, 4, 995, 991, '2015-12-18 10:00:00', '', 'Looks healthy');

		insert into Vitals(userID, visitID, vitalsDate, height, weight, BMI, temperature, pulse, respiratoryRate, bloodPressure, bloodOxygenSat)
		values(995, 899, '2015-02-01 12:00:00', '5\'10\"', '164', '23', '98.7', '110', '18', '120/80', '98%'),
			(995, 900, '2015-08-04 13:15:00', '5\'10\"', '164', '23', '98.7', '115', '17', '120/80', '98%'),
			(995, 901, '2015-10-21 09:00:00', '5\'10\"', '164', '23', '98.7', '112', '18', '120/80', '98%'),
			(996, 902, '2012-04-13 14:20:00', '5\'08\"', '172', '26', '98.7', '110', '13', '128/80', '96%'),
			(996, 903, '2012-12-01 08:00:00', '5\'08\"', '172', '26', '98.7', '113', '16', '125/80', '97%'),
			(996, 904, '2014-01-05 13:45:00', '5\'08\"', '172', '26', '98.7', '118', '17', '124/80', '98%'),
			(996, 905, '2014-03-20 15:15:00', '5\'08\"', '172', '26', '98.7', '110', '15', '123/80', '94%'),
			(996, 1011, '2014-08-12 15:15:00', '5\'08\"', '172', '26', '98.7', '110', '15', '123/80', '94%'),
			(996, 1234, '2015-02-28 15:15:00', '5\'08\"', '172', '26', '98.7', '110', '15', '123/80', '94%'),
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
			(998, 138, '2016-02-28 11:15:00', '5\'03\"', '190', '30', '98.7', '122', '23', '131/80', '78%');

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
		values(20, 995, 899, '20 mL', '2015-02-01 00:00:00', '2015-02-28 00:00:00', 'once daily', 990, 'Doctor Test0'),
			(32, 997, 906, '20 mG', '2015-01-31 00:00:00', '2015-02-13 00:00:00', 'twice daily', 993, 'Doctor Test3'),
			(14, 998, 136, '13 mL', '2016-02-28 00:00:00', '2016-04-28 00:00:00', 'once daily with food', 992, 'Doctor Test2');

		insert into ExternalData(dataID, patientID, doctorID, visitID, dataTypeID, filePath, fileName, dataName, uploadDate)
		values(1, 991, 905, 0, 10, '/path/to/file1', 'file1', 'Visit Record', '2016-03-20 15:15:00'),
			(2, 992, 903, 0, 11, '/path/to/file2', 'file2', 'Full workup', '2015-12-01 08:00:00'),
			(3, 991, 911, 0, 13, '/path/to/file3', 'file3', 'Visit Document', '2015-03-03 16:45:00'),
			(4, 993, 915, 0, 10, '/path/to/file4', 'file4', 'Vitals doc', '2016-01-26 13:00:00');

		END//

create procedure refresh_data()
	BEGIN
		call wipe_data;
		call create_data;
	END//
delimiter ;
