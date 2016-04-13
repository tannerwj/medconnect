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
		values(1, 'Ophthalmology'),
			(2, 'Cardiology'),
			(3, 'OB/GYN'),
			(4, 'Urology'),
			(5, 'Dermatology'),
			(6, 'Family Medicine'),
			(7, 'Pediatrics'),
			(8, 'Oncology');

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
		values(1, 'MRI'),
			(2, 'XRAY'),
			(3, 'Test Results'),
			(4, 'Other Scans'),
			(5, 'Exam');

		insert into Allergies(_id, name)
		values(1, 'Mold'),
			(2, 'Dust mites'),
			(3, 'Grass'),
			(4, 'Dogs'),
			(5, 'Cats');

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
		values(1, 995),
			(3, 995),
			(2, 997);

		insert into SpecialtyDoctor(specialtyID, doctorID)
		values(1, 991),
			(1, 992),
			(1, 993),
			(2, 994),
			(3, 994),
			(4, 992),
			(5, 992),
			(5, 993);

		insert into MedicationPatient(medicationID, userID, visitID, dosage, startDate, stopDate, notes, doctorID, doctorName)
		values(20, 995, 0, '20 mL', '2015-02-01 00:00:00', '2015-02-28 00:00:00', 'once daily', 990, 'Doctor Test0'),
			(32, 997, 0, '20 mG', '2015-01-31 00:00:00', '2015-02-13 00:00:00', 'twice daily', 993, 'Doctor Test3'),
			(14, 998, 0, '13 mL', '2016-02-28 00:00:00', '2016-04-28 00:00:00', 'once daily with food', 992, 'Doctor Test2');
		END//

create procedure refresh_data()
	BEGIN
		call wipe_data;
		call create_data;
	END//
delimiter ;
