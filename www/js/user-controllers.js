angular.module('starter.controllers')

.controller('UserCtrl', function($scope, $state, $http) {

  $scope.users = [ ];

      $http.get('http://localhost/api/user').
          success(function(data, status, headers, config) {
          	// learning how to access data returned from the web service
            console.log(data[0]);
            console.log(data[0].Vehicles[0].vehicle_no);
            $scope.users.push(data);
            angular.forEach(data, function(data) {
            	console.log(" first name : " + data.first_name);
            	// console.log(" first name : " + data.Vehicles[0].vehicle_no);
          	})
        });
})