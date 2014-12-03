angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SettingsCtrl', function($scope) {
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

.controller('RegisterCtrl', ["$scope", function($scope){
  // Form data for the register modal
  $scope.registerData = {};

  // Perform the registration action when the user submits the register form
  $scope.doRegister = function() {
    console.log('Registering', $scope.registerData);
    // send data to server side for validating and saving 
  };
}])

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
          title: 'Strathblane (Job Location)'
        });
        
        var hospitalRoute = new google.maps.Marker({
          position: toLocation,
          map: map,
          title: 'Hospital (Stobhill)'
        });
        
        var infowindow = new google.maps.InfoWindow({
             content:"Colombo"
        });

        infowindow.open(map,marker);
        
        var hospitalwindow = new google.maps.InfoWindow({
             content:"Kandy "
        });

        hospitalwindow.open(map,hospitalRoute);
       
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
        
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();

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

});
