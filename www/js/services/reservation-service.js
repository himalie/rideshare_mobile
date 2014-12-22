
angular.module('starter')

.factory('Reservation', ['$http', '$rootScope', '$q', 'UserFactory', 'RideFactory', function($http, $rootScope, $q, UserFactory, RideFactory) {

    var urlBase = 'http://localhost/ARideShare/api/riderinfo';
    var Reservation = {};


    Reservation.joinRide = function(position) {
    	if (UserFactory.signedIn()) { 
            return $http.post(urlBase, {
                    user_id : UserFactory.currentUser.user_id,
                    ride_id : RideFactory.currentRide.ride_id,
                    status : 'Joined',
                    start_latitude : position.latitude,
                    start_longitude : position.longitude

                }).
                  success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    Reservation.currentRes = data;
                  }).
                  error(function (data, status, headers, config) {
                    Reservation.currentRes = null;

                });
            }

        };

    // a passenger decides to leave a particular ride
    Reservation.leaveRide = function (ride_id_, user_id_){
        return $http.delete(urlBase, {params: {ride_id : ride_id_, user_id : user_id_}});
    };
    return Reservation;
}])