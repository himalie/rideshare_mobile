angular.module('starter.controllers')

// .controller('UserCtrl', function($scope) {

// $scope.users = [ ];
// function User($scope, $http) {
//     $http.get('http://localhost/api/user').
//         success(function(data) {
//         	console.log(data);
//             $scope.users.push(data);
//         });
// }

// User();
// })

.controller('UserCtrl', function($scope, $http) {

  $scope.users = [ ];

      $http.get('http://localhost/api/user').
          success(function(data) {
            console.log(data);
            $scope.users.push(data);

          });

})