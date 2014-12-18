angular.module('starter')

.controller('ReservationCtrl', function($scope, $ionicModal, $ionicLoading, $compile, $rootScope, Reservation,  RideFactory, $location, UserFactory) {

	$scope.currentUserr = UserFactory.currentUser.user_id;
	$scope.reservationData = {};

	$scope.joinRide = function(){
		if (UserFactory.signedIn()) { 
			var promise = Reservation.joinRide($scope.reservationData);
			 promise.then(function(){
			 	
			 });
		}

	};

})