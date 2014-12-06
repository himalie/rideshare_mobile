angular.module('starter.controllers')

.controller('UserCtrl', function($scope, $state, $http) {

  $scope.users = [ ];

      $http.get('http://localhost/api/user').
          success(function(data, status, headers, config) {
            angular.forEach(data, function(data) {
              $scope.users.push(data);
            	console.log(" first name : " + data.first_name.trim());
          	})
        });
})