(function () {

	var medconnect = angular.module("mcDoctor", []);

	medconnect.controller('DRController', ['$http', '$location', '$uibModal', '$scope', function ($http, $location, $uibModal, $scope) {

		var vm = this;

		var receiveInputs = function () {
			if (vm.email && vm.firstName && vm.lastName && vm.address && vm.phoneNumber && vm.password && vm.passwordConfirm && vm.code) {
				if (vm.password === vm.passwordConfirm) {
					return true;
				}
			}
			return false;
		}

		$scope.open = function (error, size) {

			if(error){
				$scope.item = "Missing/Incorrect fields, please try again.";
			}else{
				$scope.item = "Congratulations, you have successfully registered!";
			}
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: '../views/modal.html',
				controller: 'ModalInstanceCtrl',
				size: size,
				resolve: {
					item : function(){
						return $scope.item;
					}
				}
			});
		};

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
					$scope.open(false);
					console.log(data);
				}).error(function (err) {
					$scope.open(true);
					console.log('Server error: ' + err);
				})
			} else {
				$scope.open(true);
			}
		}

  }]);

	medconnect.controller('DoctorProfile', ['$http','$location', function ($http, $location) {

		var vm = this;
		$http.get('/doctor/info').success(function (info) {
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
		vm.error = false;
		vm.editMode = false;
		vm.message = "";
		vm.ids = [];
		vm.datas = [];

		vm.edit = function () {
			$http({
					method: 'POST',
					url: '/data/getStatic',
					data: {
						'type': 'specialties'
					}
				}).success(function(items){
					vm.items = items;
				});

			vm.editMode = !vm.editMode;
		}

		// http://www.newhealthguide.org/Types-Of-Doctors.html
		// sample data
		// vm.items = [
		// 	{id:1, name:'General Physician'},
		// 	{id:2, name:'Internal medical Doctor'},
		// 	{id:3, name:'Emergency Doctor'},
		// 	{id:4, name:'Hospitalist'},
		// 	{id:5, name:'Palliative care Doctor'},
		// 	{id:6, name:'General pediatrician'}
		// ];

		vm.add = function(){
			if(vm.ids.indexOf(vm.selectedItem._id) >= 0){
				vm.error = true;
				vm.message = "No duplicate speciality";
				return false;
			}else{
				vm.ids.push(vm.selectedItem._id);
				vm.datas.push(vm.selectedItem.name);
				vm.specialties = vm.datas.join(", ");
				vm.error = false;
				return true;
			}
		}

		vm.save = function () {
			console.log(vm.ids);
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
						'specialties' : vm.ids,
						'code': vm.code
					}
				}).success(function (data) {
					console.log(data);
					// $location.url('/doctor');
				}).error(function (err) {
					vm.error = true;
					vm.message = "Server error";
					console.log('Server error: ' + err);
				})
		}
  }]);

	medconnect.controller('VerifyDoctor', ['$http', function ($http) {

  }])

}());
