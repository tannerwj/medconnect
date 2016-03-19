(function () {

	var medconnect = angular.module("mcDoctor", []);

	medconnect.controller('DoctorRegister', ['$http', '$location', '$uibModal', '$scope', function ($http, $location, $uibModal, $scope) {

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

	medconnect.controller('DoctorProfile', ['$http','$location', '$uibModal', '$scope', function ($http, $location, $uibModal, $scope) {

		var vm = this;
		vm.editMode = false;
		vm.ids = [];
		vm.datas = [];
		vm.items = []; //grabs specialties from admin
		$scope.alerts = [];
		vm.error = false;
		vm.message = "";

		$http.get('/doctor/info').success(function (info) {
			var specs = info.specialties;
			var tmp = [];
			for(var o in specs) {
				var spec = specs[o];
				spec.msg = spec.name;
				$scope.alerts.push(spec)
				vm.ids.push(spec._id);
				vm.datas.push(spec.name);
			  tmp.push(spec.name);
			}
			vm.email = info.email;
			vm.firstName = info.firstName;
			vm.lastName = info.lastName;
			vm.address = info.address;
			vm.phoneNumber = info.phone;
			vm.code = info.code;
			vm.experience = info.exp;
			vm.volunteerNotes = info.vol;
			vm.otherNotes = info.notes;
			vm.specialties = tmp
			console.log(vm.ids, vm.datas)
		}).catch(function (error) {
			console.log("Error is : " + error);
		});

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

		vm.add = function(){
			if(vm.ids.indexOf(vm.selectedItem._id) >= 0){
				vm.error = true;
				vm.message = "No duplicate speciality";
				return false;
			}else{
				vm.ids.push(vm.selectedItem._id);
				vm.datas.push(vm.selectedItem.name);
				vm.specialties = vm.datas.join(", ");
				$scope.alerts.push({msg:vm.selectedItem.name});
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
				}).success(function(data){
	        $scope.open(false);
	        console.log(data);
	      }).error(function(err){
	        $scope.open(true);
	        console.log('Server error: ' + err);
	      })
		}
		// Modal open
		$scope.open = function (error, size) {

	    if(error){
	      $scope.item = "Missing/Incorrect fields, please try again.";
	    }else{
	      $scope.item = "Fantastic, you have successfully Edited your profile!";
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
		// Alert close
		$scope.closeAlert = function(index) {
			if(!vm.editMode){

			}else{
				vm.ids.splice(index, 1);
				vm.datas.splice(index, 1);
				$scope.alerts.splice(index, 1);
			}
		};

  }]);


	// medconnect.controller('AlertDemoCtrl', function ($scope) {
	//   $scope.alerts = [
	//     { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
	//   ];
	//
	//   $scope.addAlert = function() {
	//     $scope.alerts.push({msg: 'Another alert!'});
	//   };
	//
	//   $scope.closeAlert = function(index) {
	//     $scope.alerts.splice(index, 1);
	//   };
	// });

	medconnect.controller('VerifyDoctor', ['$http', function ($http) {

  }])

}());
