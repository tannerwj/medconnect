insert into Users(userID, userType, email, lastName, firstName, password)
values(990, 0, 'test0@test.com', 'Test0', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
	(991, 0, 'test1@test.com', 'Test1', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
	(992, 0, 'test2@test.com', 'Test2', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
	(993, 0, 'test3@test.com', 'Test3', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG'),
	(994, 0, 'test4@test.com', 'Test4', 'Doctor', '$2a$10$refQBWY1ZfHHUPWixvQ.Zur1pD.0s1FhHTzkxPj9z0C/80RW64rqG');

insert into DoctorProfile(userID, address, phone, verified, verificationCode, experience, volunteerNotes, otherNotes)
values(990, '123 Test St., Provo, UT 84601', '111-222-3333', -1, '12345qwert', '8 years', 'Awesome', 'other notes'),
	(991, '123 Test St., Provo, UT 84601', '111-222-3333', 0, '12345qwert', '8 years', 'Awesome', 'other notes'),
	(992, '123 Test St., Provo, UT 84601', '111-222-3333', 0, '12345qwert', '8 years', 'Awesome', 'other notes'),
	(993, '123 Test St., Provo, UT 84601', '111-222-3333', 1, '12345qwert', '8 years', 'Awesome', 'other notes'),
	(994, '123 Test St., Provo, UT 84601', '111-222-3333', 1, '12345qwert', '8 years', 'Awesome', 'other notes');




