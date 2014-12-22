angular.module('starter')

.factory('RideFactory', ['$http', '$rootScope', '$q', 'UserFactory', function($http, $rootScope, $q, UserFactory) {

	  var urlBase = 'http://localhost/ARideShare/api/ride';
    var Ride = {};
    Ride.currentRide = {};
    Ride.rideWaypoints = {};
    Ride.allRides = {};
    Ride.passengers = {};

    // Insert a Ride information to the database
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

    // add ride route details (if changed from the default) to the database
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

    // fetch ride information per given user
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

    // fetch ride information by key
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

    // fetch all rides in the database
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

    // edit ride information  and route details
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

    // edit the route of a given ride
    Ride.editRideWayoints = function(waypoint, ride_id_){
      return $http.put('http://localhost/ARideShare/api/ridecordinates/' + ride_id_, ride);
    };

    // delete a ride entered in the database
    Ride.deleteRide = function(ride_id){
      return $http.delete(urlBase +'/' + ride_id);
    };

    // delete way points of a ride
    Ride.deleteWaypoints = function(ride_id){
      return $http.delete('http://localhost/ARideShare/api/ridecordinates/' + ride_id);
    };

    // view the passengers who has joined a particular ride
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

    return Ride;
}])