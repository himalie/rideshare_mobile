angular.module('starter')

.factory('RideFactory', ['$http', '$rootScope', '$q', 'UserFactory', 'RIDESHARE_URL', function($http, $rootScope, $q, UserFactory, RIDESHARE_URL) {

  //var urlBase = 'http://192.168.43.70/api/ride'
	var urlBase = RIDESHARE_URL + 'api/ride';
  //var urlBase ='http://localhost/api/ride';

  var waypoint_url = RIDESHARE_URL+'api/ridecordinates/';
  var rider_url = RIDESHARE_URL+'api/riderinfo';
  //var urlBase = 'http://localhost/ARideShare/api/ride';
    var Ride = {};
    Ride.currentRide = {};
    Ride.rideWaypoints = {};
    Ride.allRides = {};
    Ride.passengers = {};
    Ride.userRides = {};
    Ride.passengerRides = {};

    Ride.addRide = function (rideData, routeData) {
        if (UserFactory.signedIn()) { 

    	     return $http.post(urlBase, {
                user_id : UserFactory.currentUser.user_id,
                from_location: routeData.startAddress,
                to_location : routeData.endAddress,
                ride_type :rideData.ride_type,
                available_seats: rideData.available_seats,
                start_date: rideData.date,
                start_time: rideData.startTime,
                status : 'Planned',
                comments : rideData.comments,
                start_lattitude : routeData.startLatitude,
                start_longitude :routeData.startLongitude,
                end_latitude :routeData.endLatitute,
                end_longitude : routeData.endLongitude,               
            }).
              success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                Ride.currentRide = data;
              }).
              error(function (data, status, headers, config) {
                Ride.currentRide = null;

            });
        }
        else
        {

            return false;
        }
    };

    Ride.addRideCordinates = function(waypoints) {
    	 return $http.post(waypoint_url, {
                ride_id : Ride.currentRide.ride_id,
                latitude : waypoints.location.k,
                longitude : waypoints.location.D,
            }).
              success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                //Ride.rideWaypoints.push(data);
                Ride.rideWaypoints= data;
              }).
              error(function (data, status, headers, config) {
                
                console.log('error: ' + data);
            });
    };

    Ride.loadRideRoute = function(){
    	 
    };

    Ride.getRidesByUser = function(){

     if (UserFactory.currentUser !== null){
      return $http.get(urlBase, {params: {user_id : UserFactory.currentUser.user_id}});
     }
     else {
      return false;
     }
               
    };

    // fetch the rides that the logged in user has joined
    Ride.getJoinedRidesByUser = function(){
      if (UserFactory.currentUser !== null){
        return $http.get(rider_url, {params: {user_id : UserFactory.currentUser.user_id}});
      } 
      else {
        return false;
      }

    };

    Ride.getRideByRideId = function(ride_id_){
        //return $http.get(urlBase + '/'+ride_id_);
        return $http.get(urlBase + '/'+ride_id_) 
        .success(function(data, status, headers, config) {
                Ride.currentRide = data;
              }).
              error(function (data, status, headers, config) {
                Ride.currentRide = null;
      });
    };

    Ride.getAllRides = function(){
        return $http.get(urlBase) 
        .success(function(data, status, headers, config) {
                Ride.allRides = data;
              }).
              error(function (data, status, headers, config) {
                Ride.allRides = null;
                //$scope.error = data.data;
                console.log('error: ' + data);
      });
    };

    Ride.editRide = function(ride, route){
     // return $http.put(urlBase + '/'+ride_id_);
     if (route !== undefined)
     {
        ride.start_lattitude = route.startLatitude;
        ride.start_longitude =route.startLongitude;
        ride.end_latitude =route.endLatitude;
        ride.end_longitude = route.endLongitude;
      }
      return $http.put(urlBase+'/' + ride.ride_id, ride);
    };

    Ride.editRideWayoints = function(waypoint, ride_id_){

      return $http.put(waypoint_url + ride_id_, ride);
    };

    Ride.deleteRide = function(ride_id){
      return $http.delete(urlBase +'/' + ride_id);
    };

    Ride.deleteWaypoints = function(ride_id){
      return $http.delete(waypoint_url + ride_id);
    };

    Ride.viewPassengers = function(ride_id_){
      return $http.get(rider_url, {params: {ride_id : ride_id_}})
        .success(function(data, status, headers, config){
          Ride.passengers = data;
        }).
        error(function(data, status, headers, console){
          Ride.passengers = undefined;

        });

    };

    return Ride;
}])