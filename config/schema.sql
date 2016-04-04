USE `medconnect`;

CREATE TABLE `Visits` (
	`visitID` int(15) NOT NULL AUTO_INCREMENT,
	`visitStatus` tinyint(1) NOT NULL,
	`patientID` int(15) NOT NULL,
	`doctorID` int(15) NOT NULL,
	`address` varchar(255) NOT NULL,
	`visitDate` DATETIME NOT NULL,
	`reason` varchar(255) NOT NULL,
	`diagnosis` varchar(255) NOT NULL,
	`symptoms` varchar(255) NOT NULL,
	`comments` varchar(255) NOT NULL,
	PRIMARY KEY (`visitID`)
);

CREATE TABLE `Users` (
	`userID` int(15) NOT NULL AUTO_INCREMENT,
	`userType` tinyint(1) NOT NULL,
	`email` varchar(80) NOT NULL UNIQUE,
	`lastName` varchar(80) NOT NULL,
	`firstName` varchar(80) NOT NULL,
	`password` char(128) NOT NULL,
	PRIMARY KEY (`userID`)
);

CREATE TABLE `UserType` (
	`typeID` tinyint(1) NOT NULL UNIQUE,
	`typeName` varchar(80) NOT NULL UNIQUE,
	 UNIQUE KEY `unique_usertypes` (`typeID`,`typeName`)
);

INSERT INTO `UserType` (`typeID`, `typeName`) VALUES (0, 'doctor'), (1, 'patient'), (2, 'admin');

CREATE TABLE `Vitals` (
	`userID` int(15) NOT NULL,
	`visitID` int(15) NOT NULL,
	`vitalsDate` DATETIME NOT NULL,
	`height` varchar(10) NOT NULL,
	`weight` varchar(10) NOT NULL,
	`BMI` varchar(10) NOT NULL,
	`temperature` varchar(10) NOT NULL,
	`pulse` varchar(10) NOT NULL,
	`respiratoryRate` varchar(10) NOT NULL,
	`bloodPressure` varchar(10) NOT NULL,
	`bloodOxygenSat` varchar(10) NOT NULL
);

CREATE TABLE `PatientProfile` (
	`userID` int(15) NOT NULL,
	`gender` varchar(1) NOT NULL,
	`bloodType` varchar(3) NOT NULL,
	`address` varchar(255) NOT NULL,
	`phone` varchar(12) NOT NULL,
	PRIMARY KEY (`userID`)
);

CREATE TABLE `DoctorProfile` (
	`userID` int(15) NOT NULL,
	`address` varchar(255) NOT NULL,
	`phone` varchar(12) NOT NULL,
	`verified` tinyint(1) NOT NULL,
	`verificationCode` varchar(255) NOT NULL,
	`experience` varchar(10) NOT NULL,
	`volunteerNotes` varchar(255) NOT NULL,
	`otherNotes` varchar(255) NOT NULL,
	`availability` varchar(500),
	PRIMARY KEY (`userID`)
);

CREATE TABLE `AllergyPatient` (
	`allergyID` int(5) NOT NULL,
	`userID` int(15) NOT NULL,
	 UNIQUE KEY `unique_allergies` (`allergyID`,`userID`)
);

CREATE TABLE `Allergies` (
	`_id` int(5) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL UNIQUE,
	`active` tinyint(1) NOT NULL DEFAULT 1,
	PRIMARY KEY (`_id`)
);

CREATE TABLE `MedicationPatient` (
	`medicationID` int(5) NOT NULL,
	`userID` int(15) NOT NULL,
	`visitID` int(15) NOT NULL,
	`dosage` varchar(20) NOT NULL,
	`startDate` DATETIME NOT NULL,
	`stopDate` DATETIME NOT NULL,
	`notes` varchar(255) NOT NULL,
	`doctorID` int(15) NOT NULL,
	`doctorName` varchar(80) NOT NULL,
	 UNIQUE KEY `unique_medications` (`medicationID`,`userID`)
);

CREATE TABLE `Medications` (
	`_id` int(5) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL UNIQUE,
	`active` tinyint(1) NOT NULL DEFAULT 1,
	PRIMARY KEY (`_id`)
);

CREATE TABLE `SpecialtyDoctor` (
	`specialtyID` int(5) NOT NULL,
	`doctorID` int(15) NOT NULL,
	 UNIQUE KEY `unique_specialties` (`specialtyID`,`doctorID`)
);

CREATE TABLE `Specialties` (
	`_id` int(5) NOT NULL AUTO_INCREMENT,
	`name` varchar(80) NOT NULL UNIQUE,
	`active` tinyint(1) NOT NULL DEFAULT 1,
	PRIMARY KEY (`_id`)
);

CREATE TABLE `ExternalData` (
	`dataID` int(15) NOT NULL AUTO_INCREMENT,
	`userID` int(15) NOT NULL,
	`visitID` int(15) NOT NULL,
	`dataTypeID` int(5) NOT NULL,
	`filePath` varchar(255) NOT NULL,
	`dataName` varchar(80) NOT NULL,
	`uploadDate` DATETIME NOT NULL,
	PRIMARY KEY (`dataID`)
);

CREATE TABLE `DataType` (
	`_id` int(5) NOT NULL AUTO_INCREMENT,
	`name` varchar(80) NOT NULL UNIQUE,
	`active` tinyint(1) NOT NULL DEFAULT 1,
	PRIMARY KEY (`_id`)
);

ALTER TABLE `Visits` ADD CONSTRAINT `Visits_fk0` FOREIGN KEY (`patientID`) REFERENCES `Users`(`userID`);

ALTER TABLE `Visits` ADD CONSTRAINT `Visits_fk1` FOREIGN KEY (`doctorID`) REFERENCES `Users`(`userID`);

ALTER TABLE `Users` ADD CONSTRAINT `Users_fk0` FOREIGN KEY (`userType`) REFERENCES `UserType`(`typeID`);

ALTER TABLE `Vitals` ADD CONSTRAINT `Vitals_fk0` FOREIGN KEY (`userID`) REFERENCES `Users`(`userID`);

ALTER TABLE `Vitals` ADD CONSTRAINT `Vitals_fk1` FOREIGN KEY (`visitID`) REFERENCES `Visits`(`visitID`);

ALTER TABLE `PatientProfile` ADD CONSTRAINT `PatientProfile_fk0` FOREIGN KEY (`userID`) REFERENCES `Users`(`userID`);

ALTER TABLE `DoctorProfile` ADD CONSTRAINT `DoctorProfile_fk0` FOREIGN KEY (`userID`) REFERENCES `Users`(`userID`);

ALTER TABLE `AllergyPatient` ADD CONSTRAINT `AllergyPatient_fk0` FOREIGN KEY (`allergyID`) REFERENCES `Allergies`(`_id`);

ALTER TABLE `AllergyPatient` ADD CONSTRAINT `AllergyPatient_fk1` FOREIGN KEY (`userID`) REFERENCES `Users`(`userID`);

ALTER TABLE `MedicationPatient` ADD CONSTRAINT `MedicationPatient_fk0` FOREIGN KEY (`medicationID`) REFERENCES `Medications`(`_id`);

ALTER TABLE `MedicationPatient` ADD CONSTRAINT `MedicationPatient_fk1` FOREIGN KEY (`userID`) REFERENCES `Users`(`userID`);

ALTER TABLE `MedicationPatient` ADD CONSTRAINT `MedicationPatient_fk2` FOREIGN KEY (`visitID`) REFERENCES `Visits`(`visitID`);

ALTER TABLE `MedicationPatient` ADD CONSTRAINT `MedicationPatient_fk3` FOREIGN KEY (`doctorID`) REFERENCES `Users`(`userID`);

ALTER TABLE `SpecialtyDoctor` ADD CONSTRAINT `SpecialtyDoctor_fk0` FOREIGN KEY (`specialtyID`) REFERENCES `Specialties`(`_id`);

ALTER TABLE `SpecialtyDoctor` ADD CONSTRAINT `SpecialtyDoctor_fk1` FOREIGN KEY (`doctorID`) REFERENCES `Users`(`userID`);

ALTER TABLE `ExternalData` ADD CONSTRAINT `ExternalData_fk0` FOREIGN KEY (`userID`) REFERENCES `Users`(`userID`);

ALTER TABLE `ExternalData` ADD CONSTRAINT `ExternalData_fk1` FOREIGN KEY (`visitID`) REFERENCES `Visits`(`visitID`);

ALTER TABLE `ExternalData` ADD CONSTRAINT `ExternalData_fk2` FOREIGN KEY (`dataTypeID`) REFERENCES `DataType`(`_id`);
