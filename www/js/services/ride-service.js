angular.module('starter')

.factory('RideFactory', ['$http', '$rootScope', '$q', 'UserFactory', function($http, $rootScope, $q, UserFactory) {

	var urlBase = 'http://localhost/ARideShare/api/ride';
    var Ride = {};
    Ride.currentRide = {};
    Ride.rideWaypoints = {};
    Ride.allRides = {};
    Ride.passengers = {};

    Ride.addRide = function (rideData, routeData) {
        if (UserFactory.signedIn()) { 

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
              }).
              error(function (data, status, headers, config) {
                
                console.log('error: ' + data);
            });
    };

    Ride.loadRideRoute = function(){
    	 
    };

    Ride.getRideByUser = function(){
      var deferred = $q.defer();
        $http.get(urlBase, {params: {user_id : UserFactory.currentUser.user_id}})
        .success(function(data, status, headers, config) {
 
                Ride.currentRide = data.data;
                console.log(Ride.currentRide)
                deferred.resolve(data);
              }).
              error(function (data, status, headers, config) {
                Ride.currentRide = null;
                $scope.error = error;
                console.log('error: ' + data);
                deferred.reject(data);
      });
      return deferred.promise;         
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

    Ride.getAllRides = function(){
        return $http.get(urlBase) 
        .success(function(data, status, headers, config) {
              //console.log(data)
                Ride.allRides = data;
              }).
              error(function (data, status, headers, config) {
                 Ride.allRides = null;
                $scope.error = error;
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
      console.log('COME HERE FOR EDITING ONCEEEEE')
      return $http.put(urlBase+'/' + ride.ride_id_, ride);
    };

    Ride.editRideWayoints = function(waypoint, ride_id_){
     // return $http.put(urlBase + '/'+ride_id_);

      return $http.put('http://localhost/ARideShare/api/ridecordinates/' + ride_id_, ride);
    };

    Ride.deleteRide = function(ride_id){
      return $http.delete(urlBase +'/' + ride_id);
    };

    Ride.deleteWaypoints = function(ride_id){
      return $http.delete('http://localhost/ARideShare/api/ridecordinates/' + ride_id);
    };

    Ride.viewPassengers = function(ride_id_){
      return $http.get('http://localhost/ARideShare/api/riderinfo/', {params: {ride_id : ride_id_}})
        .success(function(data, status, headers, config){
          Ride.passengers = data;
          console.log(data)
        }).
        error(function(data, status, headers, console){
          Ride.passengers = undefined;
          //$scope.error = error

        });

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