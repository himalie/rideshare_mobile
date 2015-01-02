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
        console.log('login THEN')
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
        console.log('closeeeeeeeeeeeeeeee')
        $scope.loginmodal = modal;

        $scope.loginmodal.hide();

      });

    }

    var login = Auth.login();
    console.log(login)
    if (login && typeof login.then === 'function') {
      login.then(

        function(){
          console.log('Auth login returned userrrrrrrrrrrrrrrrrrrr')
          console.log(UserFactory.currentUser)
          $scope.userDetails = UserFactory.currentUser;
        },
        function(){
          //alert('error');
        }
      );
    } else {
      showModal();
      
    }
    
    


    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      //$scope.getCurrLocation();
      $scope.loginmodal.hide();
    };



    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      $scope.error_message = "";
      console.log('Doing login ', $scope.loginData);
      var promise = UserFactory.getUser($scope.loginData.username, $scope.loginData.password);
      promise.then(function() {

          if ($rootScope.currentUser !== undefined)
          {
            Auth.setCookie();
            console.log('coming heeeeeeeeeeeeeeeee')
            $scope.userDetails = UserFactory.currentUser;
           // closeModal();
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
                    //$scope.loginData = null;
                    $scope.currentUser = null;
                    $scope.userDetails = null;
                    UserFactory.currentUser = null;
                   // $scope.userDetails.user_id = undefined;
                    console.log($scope.userDetails)
                    Auth.deleteCookie();
                    //login()
                    showModal();
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
          if($scope.userDetails.user_id !== data.data.user_id) {
            $scope.userDetails = data.data;
            console.log($scope.userDetails);
          }
        });
      }
    };

    $scope.editUser = function(){
      if(UserFactory.signedIn()){
        console.log($scope.userDetails)
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
      console.log($scope.vehicleData)
      var promise = VehicleFactory.addVehicle($scope.vehicleData);
      promise.then(function(data) {
            console.log('coming heeeeeeeeeeeeeeeee')
            console.log(data.data)
            //$scope.vehicles.push(data.data);
            $scope.vehicleModal.hide();    
            //var path = '/app/managerides/' ;

            //$location.path(path);   
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa')
            //$scope.error_message =''; 
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

            console.log($scope.vehicleDetails[i])
          }

          console.log($scope.vehicleDetails)
          $scope.vehiclesModal.show();
        });
    };

    $scope.removeVehicle = function(vehicle_id){
      var promise = VehicleFactory.removeVehicle(vehicle_id);
      promise.then(function(){
        console.log('deleted vehicle - delete vehicle record form vehicleDetails as well')
      });
    }
    // **************************

})



.controller('RegisterCtrl', function($scope, $ionicLoading, $compile, UserFactory, $rootScope, $location, Auth) {
  //Form data for the register modal
  $scope.registerData = {};
  console.log('register');
  // Perform the registration action when the user submits the register form
  $scope.doRegister = function() {
    console.log('Registering', $scope.registerData);

    var promise = UserFactory.insertUser($scope.registerData);
    promise.then(function() {
        Auth.setCookie();
        console.log(' POST '+ UserFactory.currentUser.first_name);
        console.log('POST  '+ $rootScope.currentUser);
        var path = '/app/managerides/';
        $location.path(path)
    });
    // send data to server side for validating and saving 
  };

  })



// Rideshare logic, the controller first.
.controller('RidesCtrl', function($ionicPopup, $scope,$state,$stateParams, $ionicModal, $ionicLoading, $compile, $rootScope, RideFactory, $location, UserFactory, Auth) {

  $scope.rides = [];


  $scope.currentRideId = undefined;
  if(RideFactory.currentRide !== undefined) {
    $scope.currentRideId = RideFactory.currentRide.ride_id;
  }
  console.log(UserFactory.currentUser)
  console.log(typeof UserFactory.currentUser)
  if(UserFactory.currentUser !== null){
    $scope.currentUserr = UserFactory.currentUser.user_id;
  }
  $scope.allRider = {};
  $scope.userRides = {};
  $scope.joinedRides = {};

// -------------------------
// Form data for the login modal
    // $scope.loginData = {};

    
    var showModal = function(){
      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        //animation: 'slide-in-up',
        focusFirstInput: true
      }).then(function(modal) {
        console.log('login THEN')
        $scope.loginmodal = modal;

        $scope.loginmodal.show();

      });

    }


    var login = Auth.login();
    console.log(login)
    console.log('1111111111111111111111111')
    if (login && typeof login.then === 'function') {
      console.log('1111111111111111111111111')
      login.then(

        function(){
          console.log('222222222222222222222222222')
          $scope.userDetails = UserFactory.currentUser;
          prepareUserRides();
          preparePassengerRides();
        },
        function(){
          alert('error');
        }
      );
    } else {
      showModal();
      
    }
    
    


    // // Triggered in the login modal to close it
    // $scope.closeLogin = function() {
    //   //$scope.getCurrLocation();
    //   $scope.loginmodal.hide();
    // };



    // // Perform the login action when the user submits the login form
    // $scope.doLogin = function() {
    //   console.log('Doing login ', $scope.loginData);
    //   var promise = UserFactory.getUser($scope.loginData.username, $scope.loginData.password);
    //   promise.then(function() {

    //       if ($rootScope.currentUser !== undefined)
    //       {
    //         Auth.setCookie();
    //         console.log('coming heeeeeeeeeeeeeeeee')
    //         $scope.userDetails = UserFactory.currentUser;
    //         $scope.loginmodal.hide();
            
    //         $state.transitionTo($state.current, $stateParams, {
    //             reload: true,
    //             inherit: false,
    //             notify: true
    //         });
    //       }
    //       else
    //       {
    //         $scope.error_message = 'User name or password is incorrect. Please enter your data again.';
    //       }
    //   });
    // };

    // $scope.logOut = function (){
    //   $ionicPopup.confirm({
    //             title: "Sign Out",
    //             content: "Are you sure you want to sign out?"
    //           })
    //           .then(function(result) {
    //             if(result) {
    //                 //$scope.loginData = null;
    //                 $scope.currentUser = null;
    //                 $scope.userDetails = null;
    //                 UserFactory.currentUser = null;
    //                // $scope.userDetails.user_id = undefined;
    //                 console.log($scope.userDetails)
    //                 Auth.deleteCookie();
    //                 console.log('oooooooooooooooooffffffffffffffffffffffoooooooooooooooooo')
    //                 //login()
    //                 showModal();
    //               }
    //             });
  
    // };

// -------------------------------------
  var loggedIn = function(){
    if(!UserFactory.signedIn()){
      console.log('Should pop up login dialog here 11')
      console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
      $scope.loginmodal.show();
    }
  };



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

    //$scope.getAllRides();

    // $scope.getUserRides = function(){
    //   RideFactory.getRidesByUser()
    //     .then(function(data){
    //       RideFactory.userRides = data.data;
    //       console.log(RideFactory.userRides)
    //       console.log(data.data)
    //       console.log(RideFactory.userRides.length)
    //       if (RideFactory.userRides !== "null")  {
    //         console.log(typeof RideFactory.userRides)
    //         for(var i= 0; i<RideFactory.userRides.length ; i++){
    //           $scope.userRides[i] = {id : RideFactory.userRides[i].ride_id,
    //                             from : RideFactory.userRides[i].from_location,
    //                             to : RideFactory.userRides[i].to_location,
    //                             seats : RideFactory.userRides[i].available_seats,
    //                             start_date : RideFactory.userRides[i].start_date,
    //                             start_time : RideFactory.userRides[i].start_time,
    //                             state : RideFactory.userRides[i].status};
    //         }
    //       }
    //     });

    // };

    var prepareUserRides = function(){
      RideFactory.getRidesByUser()
        .then(function(data){
          RideFactory.userRides = data.data;
          console.log(RideFactory.userRides)
          console.log(data.data)
          console.log(RideFactory.userRides.length)
          if (RideFactory.userRides !== "null")  {
            console.log(typeof RideFactory.userRides)
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


    // $scope.getPassengerRides = function(){
    //   console.log('sssssssssssssssssssssssssssssssssss');
    //   var promise = RideFactory.getJoinedRidesByUser();
    //   if (promise){
    //     promise.then(function(data){
    //       RideFactory.passengerRides = data.data;
    //       console.log(RideFactory.passengerRides)
    //       if (RideFactory.passengerRides !== 'null') {
    //         for(var i= 0; i<RideFactory.passengerRides.length ; i++){
    //           $scope.joinedRides[i] = {id : RideFactory.passengerRides[i].Ride.ride_id,
    //                             from : RideFactory.passengerRides[i].Ride.from_location,
    //                             to : RideFactory.passengerRides[i].Ride.to_location,
    //                             seats : RideFactory.passengerRides[i].Ride.available_seats,
    //                             start_date : RideFactory.passengerRides[i].Ride.start_date,
    //                             start_time : RideFactory.passengerRides[i].Ride.start_time,
    //                             state : RideFactory.passengerRides[i].Ride.status};
    //         }
    //       }
    //     });
    //   }

    // };

    var preparePassengerRides = function() {
      console.log('sssssssssssssssssssssssssssssssssss');
      var promise = RideFactory.getJoinedRidesByUser();
      if (promise){
        promise.then(function(data){
          RideFactory.passengerRides = data.data;
          console.log(RideFactory.passengerRides)
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
    //$scope.getPassengerRides();
})