angular.module('starter')

.controller('UserCtrl', function(Auth, $scope, $state, $http, $ionicModal, $timeout, UserFactory, $rootScope, $stateParams, $location, $ionicPopup, VehicleFactory) {

    // Form data for the login modal

    $scope.loginData = {};
    
    var showModal = function(){
      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        //animation: 'slide-in-up',
        focusFirstInput: true
      }).then(function(modal) {
        $scope.loginmodal = modal;

        $scope.loginmodal.show();

      });

    }

    var closeModal = function(){
      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        //animation: 'slide-in-up',
        focusFirstInput: true
      }).then(function(modal) {
        $scope.loginmodal = modal;
        $scope.loginmodal.hide();

      });

    }

    var login = Auth.login();
    if (login && typeof login.then === 'function') {
      login.then(
        function(){
          $scope.userDetails = UserFactory.currentUser;
        },
        function(){
        }
      );
    } else {
      showModal();
    }

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.loginmodal.hide();
    };



    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      $scope.error_message = "";
      var promise = UserFactory.getUser($scope.loginData.username, $scope.loginData.password);
      promise.then(function() {

          if ($rootScope.currentUser !== undefined)
          {
            Auth.setCookie();
            $scope.userDetails = UserFactory.currentUser;
            $scope.loginmodal.hide();
            
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
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
                    $scope.currentUser = null;
                    $scope.userDetails = null;
                    UserFactory.currentUser = null;                    
                    Auth.deleteCookie();
                    showModal();
                  }
                });
  
    };

    // getting the current location of the user
    $scope.getCurrLocation = function () {
      var promise = UserFactory.getCurrentLocatoin();
        promise.then(function() {
      });
    };

    $scope.userDetails = UserFactory.currentUser;

    $scope.loadUser = function(){
      var user_id_ = $stateParams.userId;
       console.log(UserFactory.currentUser)
       console.log(typeof user_id_)
      if(user_id_ === undefined){
        user_id_ = UserFactory.currentUser.user_id;
        $scope.userDetails = UserFactory.currentUser;
        $scope.userDetails.rating = UserFactory.currentUser.rating;
      }
      else{
        var promise = UserFactory.getUserById(user_id_);
        promise.then(function(data){
          if($scope.userDetails.user_id !== data.data.user_id) {
            $scope.userDetails = data.data;
            $scope.userDetails.rating = data.data.rating;
          }
        });
      }

    };

    $scope.editUser = function(){
      if(UserFactory.signedIn()){
        var promise = UserFactory.updateUser($scope.userDetails);
        promise.then(function(){
          var path = '/app/user/' + UserFactory.currentUser.user_id;
          $location.path(path);
        });
      }
      else{
        $scope.modal.show();
      }
    };

    // ************ vehicle modal ****************
    // Form data for vehicle
    $scope.vehicleData = {};
    $scope.vehicles = {};

    // Create the vehicle modal that we will use later
    $ionicModal.fromTemplateUrl('templates/vehicle.html', {
      scope: $scope,
      //animation: 'slide-in-up',
      focusFirstInput: true
    }).then(function(modal) {
      $scope.vehicleModal = modal;
    });
    //Be sure to cleanup the modal by removing it from the DOM
    $scope.$on('$destroy', function() {
      $scope.vehicleModal.remove();
    });

    // Triggered in the vehicle modal to close it
    $scope.closeVehicle = function() {
      $scope.vehicleModal.hide();
    };

    // Open the vehicle modal
    $scope.vehicle = function() {      
      $scope.vehicleModal.show();
    };

    // ------------- view vehicles----------------------
    $ionicModal.fromTemplateUrl('templates/viewvehicles.html', {
      scope: $scope,
      backdropClickToClose: false,
      //animation: 'slide-in-up',
      focusFirstInput: true
    }).then(function(modal) {
      $scope.vehiclesModal = modal;
    });
    //Be sure to cleanup the modal by removing it from the DOM
    $scope.$on('$destroy', function() {
      $scope.vehiclesModal.remove();
    });

    // Triggered in the vehicle modal to close it
    $scope.closeVehicles = function() {
      $scope.vehiclesModal.hide();
    };
    //-- ------------------------------------
    // Perform the vehicle action when the user submits the vehicle form
    $scope.addVehicle = function() {
      console.log('adddddddddddd vehicleeeeeeeeeee')
      var promise = VehicleFactory.addVehicle($scope.vehicleData);
      promise.then(function(data) {
            $scope.vehicleModal.hide();    

      });
    };

    $scope.vehicleDetails = [];
    $scope.viewVehicles = function(){
      var promise = VehicleFactory.viewVehicles();
      promise.then(function(data){

          for(var i= 0; i<data.data.length ; i++){

            var id_ = data.data[i].vehicle_id;
            $scope.vehicleDetails[i] = {id : data.data[i].vehicle_id,
                                        vehicle_no : data.data[i].vehicle_no,
                                        type : data.data[i].type,
                                        available_seats : data.data[i].available_seats};
          }
          if (data.data.length>0) {
            //$scope.vehiclesModal.show();
          }
          else{
            $scope.error_message = 'There is no vehicle details to show.'
          }
          $scope.vehiclesModal.show();
          
        });
    };

    $scope.removeVehicle = function(vehicle_id){
      var promise = VehicleFactory.removeVehicle(vehicle_id);
      promise.then(function(){
        $scope.vehicleDetails[vehicle_id]
        console.log('deleted vehicle - delete vehicle record form vehicleDetails as well')
      });
    }
    // **************************

})



.controller('RegisterCtrl', function($scope, $ionicLoading, $compile, UserFactory, $rootScope, $location, Auth) {
  //Form data for the register modal
  $scope.registerData = {};
  // Perform the registration action when the user submits the register form
  $scope.doRegister = function() {

    var promise = UserFactory.insertUser($scope.registerData);
    promise.then(function() {
        Auth.setCookie();
        var path = '/app/managerides/';
        $location.path(path)
      });
    };
  })



.controller('RidesCtrl', function($ionicPopup, $scope,$state,$stateParams, $ionicModal, $ionicLoading, $compile, $rootScope, RideFactory, $location, UserFactory, Auth) {

  $scope.rides = [];


  $scope.currentRideId = undefined;
  if(RideFactory.currentRide !== undefined) {
    $scope.currentRideId = RideFactory.currentRide.ride_id;
  }

  if(UserFactory.currentUser !== null){
    $scope.currentUserr = UserFactory.currentUser.user_id;
  }
  $scope.allRider = {};
  $scope.userRides = {};
  $scope.joinedRides = {};

// -------------------------
   
    var showModal = function(){
      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        //animation: 'slide-in-up',
        focusFirstInput: true
      }).then(function(modal) {
        $scope.loginmodal = modal;
        $scope.loginmodal.show();
      });

    }


    var login = Auth.login();

    if (login && typeof login.then === 'function') {
      login.then(

        function(){
          $scope.userDetails = UserFactory.currentUser;
          prepareUserRides();
          preparePassengerRides();
        },
        function(){
          // alert('error');
        }
      );
    } else {
      showModal();
      
    }
    

// -------------------------------------
  var loggedIn = function(){
    if(!UserFactory.signedIn()){
      $scope.loginmodal.show();
    }
  };



    $scope.getAllRides = function(){

      var promise = RideFactory.getAllRides();
      if (promise){
        promise.then(function() {
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


    var prepareUserRides = function(){
      RideFactory.getRidesByUser()
        .then(function(data){
          RideFactory.userRides = data.data;
          if (RideFactory.userRides !== "null")  {
            for(var i= 0; i<RideFactory.userRides.length ; i++){
              $scope.userRides[i] = {id : RideFactory.userRides[i].ride_id,
                                from : RideFactory.userRides[i].from_location,
                                to : RideFactory.userRides[i].to_location,
                                seats : RideFactory.userRides[i].available_seats,
                                start_date : RideFactory.userRides[i].start_date,
                                start_time : RideFactory.userRides[i].start_time,
                                state : RideFactory.userRides[i].status};
            }

          }
        });
      
    }


    var preparePassengerRides = function() {
      var promise = RideFactory.getJoinedRidesByUser();
      if (promise){
        promise.then(function(data){
          RideFactory.passengerRides = data.data;
          if (RideFactory.passengerRides !== 'null') {
            for(var i= 0; i<RideFactory.passengerRides.length ; i++){
              $scope.joinedRides[i] = {id : RideFactory.passengerRides[i].Ride.ride_id,
                                from : RideFactory.passengerRides[i].Ride.from_location,
                                to : RideFactory.passengerRides[i].Ride.to_location,
                                seats : RideFactory.passengerRides[i].Ride.available_seats,
                                start_date : RideFactory.passengerRides[i].Ride.start_date,
                                start_time : RideFactory.passengerRides[i].Ride.start_time,
                                state : RideFactory.passengerRides[i].Ride.status};
            }
          }
        });
      }

    }
})