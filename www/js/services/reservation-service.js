
angular.module('starter')

.factory('Reservation', ['$http', '$rootScope', '$q', 'UserFactory', 'RideFactory', function($http, $rootScope, $q, UserFactory, RideFactory) {


var urlBase = 'http://localhost/api/riderinfo';
//var urlBase = 'http://localhost/ARideShare/api/riderinfo';
var Reservation = {};

console.log('wwwwwwwwddddddddddddddddddddwwwwwwwwwww')


Reservation.joinRide = function(position) {
    console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwww')
    console.log(position)
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
                console.log('successsssssssssssssssssss')
                Reservation.currentRes = data;
              }).
              error(function (data, status, headers, config) {
                Reservation.currentRes = null;

            });
        }

    };

    Reservation.leaveRide = function (ride_id_, user_id_){


        //http://localhost/ARideShare/api/riderinfo?ride_id=23&user_id=1
        
        return $http.delete(urlBase, {params: {ride_id : ride_id_, user_id : user_id_}});

    };

    return Reservation;
}])