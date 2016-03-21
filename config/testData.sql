drop procedure IF EXISTS wipe_data;
drop procedure IF EXISTS create_data;
drop procedure IF EXISTS refresh_data;

delimiter //
create procedure wipe_data()
	BEGIN
		truncate table DoctorProfile;
		truncate table SpecialtyDoctor;	
		delete from Specialties;
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

		insert into Users(userID, userType, email, lastName, firstName, password)
		values(990, 0, 'test0@test.com', 'Test0', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(991, 0, 'test1@test.com', 'Test1', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(992, 0, 'test2@test.com', 'Test2', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(993, 0, 'test3@test.com', 'Test3', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(994, 0, 'test4@test.com', 'Test4', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(995, 2, 'admin1@admin.com', 'Test5', 'Admin', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(996, 2, 'admin2@admin.com', 'Test6', 'Admin', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(997, 2, 'admin3@admin.com', 'Test7', 'Admin', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
			(998, 2, 'admin4@admin.com', 'Test8', 'Admin', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG');
		
		insert into DoctorProfile(userID, address, phone, verified, verificationCode, experience, volunteerNotes, otherNotes)
		values(990, '123 Test St., Provo, UT 84601', '111-222-3333', -1, '12345qwert', '8 years', 'Awesome', 'other notes'),
			(991, '123 Test St., Provo, UT 84601', '111-222-3333', 0, '12345qwert', '8 years', 'Awesome', 'other notes'),
			(992, '123 Test St., Provo, UT 84601', '111-222-3333', 0, '12345qwert', '8 years', 'Awesome', 'other notes'),
			(993, '123 Test St., Provo, UT 84601', '111-222-3333', 1, '12345qwert', '8 years', 'Awesome', 'other notes'),
			(994, '123 Test St., Provo, UT 84601', '111-222-3333', 1, '12345qwert', '8 years', 'Awesome', 'other notes');

		insert into SpecialtyDoctor(specialtyID, doctorID)
		values(991, 991),
			(991, 992),
			(991, 993),
			(992, 994),
			(993, 994),
			(994, 992),
			(996, 992),
			(996, 993);
		END//

create procedure refresh_data()
	BEGIN
		call wipe_data;
		call create_data;
	END//
delimiter ;