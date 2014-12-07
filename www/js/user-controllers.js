angular.module('starter.controllers')

.controller('UserCtrl', function($scope, $state, $http) {

  $scope.users = [ ];

  // get all users
  function getAllUsers() {
    $http.get('http://localhost/api/user').
    success(function(data, status, headers, config) {
      angular.forEach(data, function(data) {
        $scope.users.push(data);
        console.log(" first name : " + data.first_name.trim());
      })
    });
  };

  function getUserByUserName() { 
    $http.get('http://localhost/api/user', {params: {user_name : 'himhh'}}).
      success(function(data, status, headers, config) {
          $scope.users.push(data);
          console.log(data);
          console.log(" first name : " + data.first_name.trim());
    });
  };


function getUserById() {
  $http.get('http://localhost/api/user', {params: {id : 1}}).
    success(function(data, status, headers, config) {
        $scope.users.push(data);
        console.log(data);
        console.log(" first name : " + data.first_name.trim());
    });
};

function getVehicle() {
  $http.get('http://localhost/api/vehicle', {params: {id : 2}}).
    success(function(data, status, headers, config) {
      angular.forEach(data, function(data) {
        $scope.users.push(data);
        console.log(data);
        console.log(" vehicle_no : " + data.vehicle_no.trim());
    });
  });
};

function registerUser() {
  $http.post('http://localhost/api/user', {
    first_name : 'from ionic 1',
    last_name : 'onic again',
    user_name : 'uniq1',
    gender : 'F',
    password : 'ionic',
    email : 'ddd',
    location : 'teest'
  }).
  success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    console.log(data);
  })

};

console.log("beforeeeeeeeee");
  //registerUser();

  console.log("afterrrrrrrrr");
  // for testing 
    //getVehicle();
    getUserByUserName();
   // getUserById();
    //getAllUsers();

})


