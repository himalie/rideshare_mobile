angular.module('starter')

.controller('UserCtrl', function($scope, $state, $http, $ionicModal, $timeout, UserFactory, $rootScope) {


// Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    console.log(" ddd "+ UserFactory.currentUser.first_name);
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    console.log(" ddd "+ UserFactory.currentUser.first_name);
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login ', $scope.loginData);
    var promise = UserFactory.getUser($scope.loginData.username, $scope.loginData.password);
    promise.then(function() {
        console.log('TTRYY '+ UserFactory.currentUser.first_name);
        console.log('TTRYY '+ $rootScope.currentUser);
    });

  // =============================================================================================
  // UserFactory.getUser($scope.loginData.username, $scope.loginData.password)
  //             .success(function (data, status, headers, config) {
  //                 console.log(' DATA ' + data.user_name );
  //             })
  //             .error(function (error) {
  //                 console.log(' ERROR '  );
  //             });

// =============================================================================================
   // var currentUser = UserFactory.getUser($scope.loginData.username, $scope.loginData.password);

    // currentUser.then(
    //   function(data){
    //     console.log('NEW CONTROLLER ='+ data.user_name);
    //   },
    //     function(errorPayLoad){
    //       console.log('NEW CONTROLLER error');
    //     });


    // //var login_val =User.findByUsername($scope.loginData.username);
    // console.log("CONTROLLER val := "+ currentUser);
    // console.log('CONTROLLERuser name : ' + UserFactory.currentUser.first_name);
    // if (UserFactory.signedIn()) {
    //   console.log('CONTROLLER not undefined!!!!!!!!!'  );
    // }
    // else
    // {
    //   console.log(' CONTROLLERelse'  );
    // }
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system

  };

    // **************************
    //   $scope.users = [ ];

    //   // get all users
    //   function getAllUsers() {
    //     $http.get('http://localhost/api/user').
    //     success(function(data, status, headers, config) {
    //       angular.forEach(data, function(data) {
    //         $scope.users.push(data);
    //         console.log(" first name : " + data.first_name.trim());
    //       })
    //     });
    //   };

    //   function getUserByUserName(user_name_, password_) { 
    //     $http.get('http://localhost/ARideShare/api/user', {params: {user_name : user_name_, password : password_}}).
    //       success(function(data, status, headers, config) {
    //           $scope.users.push(data);
    //           console.log(user_name_ + ' , '+ password_);
    //           console.log(data);
    //           console.log(" first name : " + data.first_name);
    //     });
    //   };


    // function getUserById() {
    //   $http.get('http://localhost/api/user', {params: {id : 1}}).
    //     success(function(data, status, headers, config) {
    //         $scope.users.push(data);
    //         console.log(data);
    //         console.log(" first name : " + data.first_name.trim());
    //     });
    // };

    // function getVehicle() {
    //   $http.get('http://localhost/api/vehicle', {params: {id : 2}}).
    //     success(function(data, status, headers, config) {
    //       angular.forEach(data, function(data) {
    //         $scope.users.push(data);
    //         console.log(data);
    //         console.log(" vehicle_no : " + data.vehicle_no.trim());
    //     });
    //   });
    // };

    // function registerUser() {
    //   $http.post('http://localhost/ARideShare/api/user', {
    //     first_name : 'from ionic 1',
    //     last_name : 'onic again',
    //     user_name : 'uniq111',
    //     gender : 'F',
    //     password : 'ioniccc',
    //     email : 'ddd',
    //     location : 'teest'
    //   }).
    //   success(function(data, status, headers, config) {
    //     // this callback will be called asynchronously
    //     // when the response is available
    //     console.log(data);
    //   })

    // };

console.log("beforeeeeeeeee");
  //registerUser();

  console.log("afterrrrrrrrr");
  // for testing 
    //getVehicle();
    //getUserByUserName();
   // getUserById();
    //getAllUsers();

})

.controller('RegisterCtrl', function($scope, $ionicLoading, $compile, UserFactory, $rootScope) {
  //Form data for the register modal
  $scope.registerData = {};
console.log('register');
  // Perform the registration action when the user submits the register form
  $scope.doRegister = function() {
    console.log('Registering', $scope.registerData);

    var promise = UserFactory.insertUser($scope.registerData);
    promise.then(function() {
        console.log(' POST '+ UserFactory.currentUser.first_name);
        console.log('POST  '+ $rootScope.currentUser);
    });
    // send data to server side for validating and saving 
  };
  function initialize() {
        var myLatlng = new google.maps.LatLng(7.2964,80.6350);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
      }
      google.maps.event.addDomListener(window, 'load', initialize);
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
      //initialize();

  })



.controller('SettingsCtrl', function($scope, UserFactory) {
  console.log('settings '+ UserFactory.currentUser.user_name);
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('AddRideCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})


.controller('RideCtrl', function($scope, $ionicLoading, $compile){  
  // A single ride
    $scope.rideData = {};
    $scope.fromLocationMap = 'kandy';
    $scope.toLocationMap = 'colombo';
    $scope.availableSeats = 4;
    $scope.rideStatus = 'planned';

      function initialize() {
        var fromLocation = new google.maps.LatLng(6.9218386,79.8562055);
        var toLocation = new google.maps.LatLng(7.2945453,80.6257814);
      
        var mapOptions = {
          streetViewControl:true,
          center: fromLocation,
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: fromLocation,
          map: map,
          title: 'Kandy'
        });
        
        var hospitalRoute = new google.maps.Marker({
          position: toLocation,
          map: map,
          title: 'Colombo'
        });
        
        var infowindow = new google.maps.InfoWindow({
             content:"Colombo"
        });

        infowindow.open(map,marker);
        
        var hospitalwindow = new google.maps.InfoWindow({
             content:"Kandy"
        });

        hospitalwindow.open(map,hospitalRoute);
       
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
        
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();

        // var mapUrl = "http://maps.google.com/maps/api/staticmap?center=";
        // mapUrl = mapUrl + position.coords.latitude + ',' + position.coords.longitude;
        // mapUrl = mapUrl + '&zoom=15&size=512x512&maptype=roadmap&sensor=true';

        var request = {
            origin : fromLocation,
            destination : toLocation,
            travelMode : google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });

        directionsDisplay.setMap(map); 
       
      }
  
      google.maps.event.addDomListener(window, 'load', initialize);
    
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });
        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };

      initialize();
})

// Rideshare logic, the controller first.
.controller('RidesCtrl', function($scope) {
  $scope.rides = [
    { id: 1, from: 'Gampola', to: 'Kandy'},
    { id: 2, from: 'Peradeniya', to: 'Kandy'},
    { id: 3, from: 'Pilimatalawa', to: 'Kandy'},
    { id: 4, from: 'Gampola', to: 'Colombo'},
    { id: 5, from: 'Katugastota', to: 'Kurunegala'},
    { id: 6, from: 'Katugastota', to: 'Kandy'}
  ];

})