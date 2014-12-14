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
      $scope.getCurrLocation();
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
          console.log('User name in Gobal data '+ UserFactory.currentUser.first_name);
          console.log('User name '+ $rootScope.currentUser);
          if ($rootScope.currentUser !== undefined)
          {
            $scope.modal.hide();       
            $scope.error_message =''; 
          }
          else
          {
            $scope.error_message = 'User name or password is incorrect. Please enter your data again.';
          }
      });
    };

    // getting the current location of the user
    $scope.getCurrLocation = function () {
      var promise = UserFactory.getCurrentLocatoin();
      promise.then(function() {
        console.log('POsition lat  '+ $rootScope.position.coords.latitude);
        console.log('POsition long '+ $rootScope.position.coords.longitude);
    });
  };

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
    var promise = UserFactory.getCurrentLocatoin();
      promise.then(function() {
      console.log();
        //var myLatlng = new google.maps.LatLng(7.2964,80.6350);
        var myLatlng = new google.maps.LatLng($rootScope.position.coords.latitude,$rootScope.position.coords.longitude);
        console.log('^^^^^^^^^^ '+myLatlng);
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

        // var marker = new google.maps.Marker({
        //   position: myLatlng,
        //   map: map,
        //   title: 'Uluru (Ayers Rock)'
        // });

        google.maps.event.addListener(map, 'click', function(e) {
         // infowindow.open(map,marker);
         console.log('**********'+e.latLng);
          placeMarker(e.latLng, map);

        });

        $scope.map = map;
       });
      };

      function placeMarker(position1, map1) {
        var marker = new google.maps.Marker({
          position: position1,
          map: map1
        });
        console.log('clicking port ='+ position1.lat());
        map1.panTo(position1);
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