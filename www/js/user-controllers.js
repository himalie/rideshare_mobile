angular.module('starter')

.controller('UserCtrl', function($scope, $state, $http, $ionicModal, $timeout, UserFactory, $rootScope, $stateParams, $location, $ionicPopup) {

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
            $scope.userDetails = UserFactory.currentUser;
            $scope.modal.hide();       
            $scope.error_message =''; 
          }
          else
          {
            $scope.error_message = 'User name or password is incorrect. Please enter your data again.';
          }
      });
    };

    $scope.logOut = function (){
      $ionicPopup.confirm({
                title: "Sign Out",
                content: "Are you sure you want to sign out?"
              })
              .then(function(result) {
                if(result) {
                    $scope.loginData = undefined;
                    $scope.currentUser = undefined;
                    $scope.userDetails = undefined;
                    var path = '/app/findride/' ;
                    $location.path(path);
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

  $scope.userDetails = UserFactory.currentUser;

  $scope.loadUser = function(){
    var user_id_ = $stateParams.userId;
    if(user_id_ === undefined){
      user_id_ = UserFactory.currentUser.user_id;
      $scope.userDetails = UserFactory.currentUser;
      //$scope.userDetails.gender.trim();
    }
    else{
      var promise = UserFactory.getUserById(user_id_);
      promise.then(function(data){
        $scope.userDetails = data.data;
        console.log($scope.userDetails);

      });
    }
  };

  $scope.editUser = function(){
    if(UserFactory.signedIn()){
      var promise = UserFactory.updateUser($scope.userDetails);
      promise.then(function(){
        console.log('data edited');
        console.log(UserFactory.currentUser.user_id)
        var path = '/app/user/' + UserFactory.currentUser.user_id;
        $location.path(path);
      });
    }
    else{
      $scope.modal.show();
    }
  };

})



.controller('RegisterCtrl', function($scope, $ionicLoading, $compile, UserFactory, $rootScope, $location) {
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
        var path = '/app/findride/';
        $location.path(path)
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
          placeMarkerRegister(e.latLng, map);

        });

        $scope.map = map;
       });
      };

      function placeMarkerRegister(position1, map1) {
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


.controller('PlaylistCtrl', function($scope, $stateParams) {
})



// Rideshare logic, the controller first.
.controller('RidesCtrl', function($scope, $ionicModal, $ionicLoading, $compile, $rootScope, RideFactory, $location, UserFactory) {
  // $scope.rides = [
  //   { id: 1, from: 'Gampola', to: 'Kandy'},
  //   { id: 2, from: 'Peradeniya', to: 'Kandy'},
  //   { id: 3, from: 'Pilimatalawa', to: 'Kandy'},
  //   { id: 4, from: 'Gampola', to: 'Colombo'},
  //   { id: 5, from: 'Katugastota', to: 'Kurunegala'},
  //   { id: 6, from: 'Katugastota', to: 'Kandy'}
  // ];

  $scope.rides = [];

  $scope.currentRideId = RideFactory.currentRide.ride_id;
  $scope.currentUserr = UserFactory.currentUser.user_id;
  $scope.allRider = {};

  $scope.getAllRides = function(){

    var promise = RideFactory.getAllRides();
    if (promise){
      promise.then(function() {
        console.log(RideFactory.allRides.length);
        for(var i= 0; i<RideFactory.allRides.length ; i++){
          $scope.rides[i] = {id : RideFactory.allRides[i].ride_id,
                            from : RideFactory.allRides[i].from_location,
                            to : RideFactory.allRides[i].to_location}
        }

      });
    }
    else {
        $scope.error_message = 'some things wrong';
    }
    };
    $scope.getAllRides();

})