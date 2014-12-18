
angular.module('starter')

.factory('Reservation', ['$http', '$rootScope', '$q', 'UserFactory', 'RideFactory', function($http, $rootScope, $q, UserFactory, RideFactory) {


var urlBase = 'http://localhost/ARideShare/api/riderinfo';
var Reservation = {};

Reservation.joinRide = function() {
	if (UserFactory.signedIn()) { 
        return $http.post(urlBase, {
                user_id : UserFactory.currentUser.user_id,
                ride_id : RideFactory.currentRide.ride_id,
                status : 'Joined'

            }).
              success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                Reservation.currentRes = data.data;
              }).
              error(function (data, status, headers, config) {
                Reservation.currentRes = null;

            });
        }

    };

    return Reservation;
}])