angular.module('starter')

.factory('VehicleFactory', ['$http', '$rootScope', '$q', 'UserFactory', 'RIDESHARE_URL', function($http, $rootScope, $q, UserFactory, RIDESHARE_URL) {

	var urlBase = RIDESHARE_URL + 'api/vehicle';
	var Vehicle = {};

	Vehicle.addVehicle = function (vehicle) {

    var deferred = $q.defer();
    return $http.post(urlBase, {
     		   user_id : UserFactory.currentUser.user_id,
           vehicle_no : vehicle.vehicle_no,
           type : vehicle.type,
           available_seats : vehicle.available_seats 
         });
  };

  Vehicle.viewVehicles = function(){
    return $http.get(urlBase, {params: {user : UserFactory.currentUser.user_id}});
  };

  Vehicle.removeVehicle = function(vehicle_id_){
    return $http.delete(urlBase+ '/'+vehicle_id_);
  };

	return Vehicle;

}])