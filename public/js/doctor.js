(function () {

	var medconnect = angular.module("mcDoctor", []);

	medconnect.controller('DRController', ['$http', '$location', function ($http, $location) {

		var vm = this;
		vm.error = true;

		var receiveInputs = function () {
			if (vm.email && vm.firstName && vm.lastName && vm.address && vm.phoneNumber && vm.password && vm.passwordConfirm && vm.code) {
				if (vm.password === vm.passwordConfirm) {
					return true;
				}
			}
			return false;
		}

		vm.register = function () {
			if (receiveInputs()) {
				$http({
					method: 'POST',
					url: '/doctor/register',
					data: {
						'email': vm.email,
						'first': vm.firstName,
						'last': vm.lastName,
						'address': vm.address,
						'phone': vm.phoneNumber,
						'password': vm.password,
						'code': vm.code
					}
				}).success(function (data) {
					console.log(data);
				}).error(function (err) {
					console.log('Server error: ' + err);
				})
				$location.url('/')
			} else {
				vm.error = false;
			}
		}

  }]);

	medconnect.controller('DoctorProfile', ['$http','$location', function ($http, $location) {

		var vm = this;
		vm.error = false;
		vm.editMode = false;
		vm.message = "";

		$http.get('/doctor/info').success(function (info) {
			console.log(info);
			vm.email = info.email;
			vm.firstName = info.firstName;
			vm.lastName = info.lastName;
			vm.address = info.address;
			vm.phoneNumber = info.phone;
			vm.experience = info.exp;
			vm.volunteerNotes = info.vol;
			vm.otherNotes = info.notes;
			vm.code = info.code;
		}).catch(function (error) {
			console.log("Error is : " + error);
		});

		vm.edit = function () {
			vm.editMode = !vm.editMode;
		}

		vm.save = function () {
			$http({
					method: 'POST',
					url: '/doctor/edit',
					data: {
						'firstName': vm.firstName,
						'lastName': vm.lastName,
						'address': vm.address,
						'phone': vm.phoneNumber,
						'experience': vm.experience,
						'volunteerNotes': vm.volunteerNotes,
						'otherNotes': vm.otherNotes,
						'code': vm.code
					}
				}).success(function (data) {
					console.log(data);
					$location.url('/doctor');
				}).error(function (err) {
					vm.error = true;
					vm.message = "Server error";
					console.log('Server error: ' + err);
				})
				//$location.url('/');
		}
  }]);

	medconnect.controller('VerifyDoctor', ['$http', function ($http) {

  }])

}());
