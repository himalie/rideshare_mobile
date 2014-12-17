angular.module('starter')

.factory('RideFactory', ['$http', '$rootScope', '$q', 'UserFactory', function($http, $rootScope, $q, UserFactory) {

	var urlBase = 'http://localhost/ARideShare/api/ride';
    var Ride = {};
    Ride.currentRide = {};
    Ride.rideWaypoints = {};

    Ride.addRide = function (rideData, routeData) {
        if (UserFactory.signedIn()) { 
          console.log(rideData)

    	     return $http.post(urlBase, {
                user_id : UserFactory.currentUser.user_id,
                from_location: routeData.startAddress,
                to_location : routeData.endAddress,
                ride_type :'car',
                available_seats: rideData.availableSeats,
                start_date: rideData.date,
                start_time: rideData.startTime,
                //estimated_end_time: ,
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
                console.log('POST SERVICE='+ Ride.currentRide.ride_id);
              }).
              error(function (data, status, headers, config) {
                console.log('Ride.currentRide is NULL');
                Ride.currentRide = null;

            });
        }
        else
        {

            return false;
        }
    };

    Ride.addRideCordinates = function(waypoints) {
        console.log(waypoints)
    	 return $http.post('http://localhost/ARideShare/api/ridecordinates', {
                ride_id : Ride.currentRide.ride_id,
                latitude : waypoints.location.k,
                longitude : waypoints.location.D,
            }).
              success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                //Ride.rideWaypoints.push(data);
                Ride.rideWaypoints= data;
                console.log('POST cordinates='+ data);
              }).
              error(function (data, status, headers, config) {
                
                console.log('error: ' + data);
            });
    };

    Ride.loadRideRoute = function(){
    	 
    };

    Ride.getRideByUser = function(){

        return $http.get(urlBase, {params: {user_id : UserFactory.currentUser.user_id}})
        .success(function(data, status, headers, config) {
 
                Ride.currentRide = data;
              }).
              error(function (data, status, headers, config) {
                Ride.currentRide = null;
                $scope.error = error;
                console.log('error: ' + data);
      });
    };

    Ride.getRideByRideId = function(ride_id_){
      console.log('getting data' + urlBase);
        //return $http.get(urlBase + '/'+ride_id_);
        return $http.get(urlBase + '/'+ride_id_) 
        .success(function(data, status, headers, config) {
                //console.log(data);
                console.log('get worked');
                Ride.currentRide = data;
              }).
              error(function (data, status, headers, config) {
                Ride.currentRide = null;
                $scope.error = error;
                console.log('error: ' + data);
      });
    };

    Ride.editRide = function(ride, route){
     // return $http.put(urlBase + '/'+ride_id_);
     console.log(route);
      ride.start_lattitude = route.startLatitude;
      ride.start_longitude =route.startLongitude;
      ride.end_latitude =route.endLatitude;
      ride.end_longitude = route.endLongitude;
      return $http.put(urlBase+'/' + ride.ride_id_, ride);
    };

    Ride.editRideWayoints = function(ride){
     // return $http.put(urlBase + '/'+ride_id_);

      return $http.put('http://localhost/ARideShare/api/ridecordinates/' + ride.ride_id_, ride);
    };

    Ride.deleteRide = function(ride_id){
      return $http.delete(urlBase +'/' + ride_id);
    };

// no need to fetch waypoints separately.. it is automatically fetched when u fetch Ride information
    // Ride.getWaypoints = function(ride_id_) {
    //     return $http.get('http://localhost/ARideShare/api/ridecordinates/'+ride_id_)
    //     .success(function(data, status, headers, config) {
    //             console.log(data);
    //             console.log('get worked');
    //             Ride.waypoints = data;
    //           }).
    //           error(function (data, status, headers, config) {
    //             Ride.waypoints = null;
    //             $scope.error = error;
    //             console.log('error: ' + data);
    //   });
    // };

    return Ride;
}])