angular.module('starter')

.controller('AddRideCtrl', function($scope, $ionicModal, $ionicLoading, $compile, $rootScope, RideFactory, $location, UserFactory) {
    
    $scope.rideData = {};
    $scope.currentRideId = RideFactory.currentRide.ride_id;
    $scope.currentUserr = UserFactory.currentUser.user_id;
    $scope.addRide = function(){

      var promise = RideFactory.addRide($scope.rideData, $scope);
      if (promise)
      {
        promise.then(function(){          
          if ($scope.waypoints !== undefined)
          {

            for(var i= 0; i<$scope.waypoints.length ; i++){
              var promise_waypoits = RideFactory.addRideCordinates($scope.waypoints[i]);
              promise_waypoits.then(function(){
              
              });
            }
            $scope.currentRideId = RideFactory.currentRide.ride_id;
            var path = '/app/ride/'+ RideFactory.currentRide.ride_id + '/' + false;
            $location.path(path);
          }
          $scope.currentRideId = RideFactory.currentRide.ride_id;
          var path = '/app/ride/'+ RideFactory.currentRide.ride_id + '/' + false;
          $location.path(path);
        });
      }
      else
      {
          if (!UserFactory.signedIn()) {
          // Create the login modal that we will use later
          $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
          }).then(function(modal) {
            $scope.modal = modal;
          });
          // Open the login modal
          $scope.login = function() {
            $scope.modal.show();
          };

          var path = '/app/ride/';
          //$location.path(path);
          $scope.login();
        }
      }
    };
    
    var rendererOptions = {
      draggable: true
    };
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;
    var count = 0;
    var markers = [];

    function initialize() {  
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);    
        //var myLatlng = new google.maps.LatLng(7.2964,80.6350);
        var myLatlng = new google.maps.LatLng(6.9218386,79.8562055);
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        //display the route
        directionsDisplay.setMap(map);
        // set the route draggable
        google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
          $scope.myroute = directionsDisplay.getDirections();

          $scope.waypoints = directionsDisplay.directions.routes[0].legs[0].via_waypoint;
          //computeTotalDistance(directionsDisplay.getDirections());
          $scope.startAddress = directionsDisplay.getDirections().routes[0].legs[0].start_address;
          $scope.endAddress = directionsDisplay.getDirections().routes[0].legs[0].end_address
          $scope.startLatitude = directionsDisplay.getDirections().routes[0].legs[0].start_location.k;
          $scope.startLongitude = directionsDisplay.getDirections().routes[0].legs[0].start_location.D;
          $scope.endLatitute = directionsDisplay.getDirections().routes[0].legs[0].end_location.k;
          $scope.endLongitude = directionsDisplay.getDirections().routes[0].legs[0].end_location.D;


        });
        
        google.maps.event.addListener(map, 'click', function(e) {
         // infowindow.open(map,marker);


          placeMarker(e.latLng, map);
          if (markers.length ===2)
          {
            var fromLocation = new google.maps.LatLng(markers[0].position.lat(),markers[0].position.lng());
            var toLocation = new google.maps.LatLng(markers[1].position.lat(),markers[1].position.lng());
              
              var start = new google.maps.Marker({
                          position: markers[0].position,
                          map: map
                        });
              var end = new google.maps.Marker({
                          position: markers[1].position,
                          map: map
                        });
              var request = {
                  origin:fromLocation,
                  destination:toLocation,
                  // if u wanna show waypoints in the route use below code
                  //waypoints : [{location: new google.maps.LatLng(6.9237284, 79.87322849999998)}],                  
                  travelMode: google.maps.TravelMode.DRIVING
              };
              directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setDirections(response);
                  var route_names = directionsDisplay.getDirections();

                }
              });

          }
        });
        $scope.map = map;               
      };
      var getMarkerUniqueId= function(lat, lng) {
        return lat + '_' + lng;
    }
      function placeMarker(position, map) {
        var markerId = getMarkerUniqueId(position.lat(), position.lng());
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          draggable:true,
          //id: 'marker_' + markerId
        });


        //markers[markerId] = marker; // cache marker in markers object
        //count ++;
        //bindMarkerEvents(marker);

        //console.log(markers[markerId]);

        google.maps.event.addListener(marker, 'dragend', function(){
          alert(marker.getPosition())
            //(marker.getPosition());
        });

        markers.push(marker);

         for (var i = 0; i < markers.length; i++) {
             //markers[i].setMap(map);
             console.log( markers[i].position.lat());
             console.log( markers[i].position.lng());
          }
        map.panTo(position);
      }
      var bindMarkerEvents = function(marker) {
          google.maps.event.addListener(marker, "rightclick", function (point) {
              var markerId = getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()); // get marker id by using clicked point's coordinate
              var marker = markers[markerId]; // find marker
              removeMarker(marker, markerId); // remove it
              count = count -1;
          });
      };
      var removeMarker = function(marker, markerId) {
          marker.setMap(null); // set markers setMap to null to remove it from map
          delete markers[markerId]; // delete marker instance from markers object
      };

      function computeTotalDistance(result) {
        var total = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }
        total = total / 1000.0;
        $scope.totalDistance = total;
        console.log('distance' + total);
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

      
      
      initialize();


})

// Rideshare logic, the controller first.
.controller('RideCtrl', function($scope, $ionicLoading, $ionicModal, $compile, RideFactory, $rootScope, $location, $stateParams, UserFactory, Reservation, $ionicPopup, $ionicPopover) {


    $scope.rideDetails = {};
    $scope.reservationData = {};

    $scope.valueD = "fdfdfdfd";

    $scope.rideAuthor = RideFactory.currentRide.user_id;
    $scope.currentUserr = UserFactory.currentUser.user_id;
    //$scope.currentRider = Reservation.currentRes.user_id;




    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    $ionicPopover.fromTemplateUrl('ride.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    
    // *********************Methods used for Passenger activitites*************************************

     $scope.reservationPosition = {};
     var markers = [];
    // Create a modal to fetch passenger pick up position
    $ionicModal.fromTemplateUrl('templates/joinride.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modalPosition = modal;
    });

    $scope.closePositionMarker = function() {
      console.log(" ddd "+ UserFactory.currentUser.first_name);
      $scope.modalPosition.hide();
    };

    var directionsDisplay2;
    var directionsService2 = new google.maps.DirectionsService();

    var loadPositionMap = function () {

    };

    $scope.loadPositionMarker = function(){
        var promise = UserFactory.getCurrentLocatoin();

        promise.then(function() {
          console.log();
          var myLatlng = new google.maps.LatLng($rootScope.position.coords.latitude,$rootScope.position.coords.longitude);
          directionsDisplay2 = new google.maps.DirectionsRenderer();
          var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          var map = new google.maps.Map(document.getElementById("map_position"),
              mapOptions);        
          google.maps.event.addListener(map, 'click', function(e) {
            placeMarkerPosition(e.latLng, map);
             console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@')
            console.log(markers[0].position.D)
            console.log(markers[0].position.k)
          });

          $scope.map_position = map;
          directionsDisplay2.setMap(map);

          // start the route
          var startPosition = new google.maps.LatLng($scope.rideDetails.start_lattitude, $scope.rideDetails.start_longitude);
          var endPosition = new google.maps.LatLng($scope.rideDetails.end_latitude, $scope.rideDetails.end_longitude);
          var wypoints = [];

          for (key in $scope.rideDetails.RideCordinates) {        

              wypoints.push({
            location:new google.maps.LatLng($scope.rideDetails.RideCordinates[key].latitude, $scope.rideDetails.RideCordinates[key].longitude),
            stopover:false});
          }
          var start_title = $scope.rideDetails.from_location;
          var end_title = $scope.rideDetails.to_location;
          //console.log(wypoints.lenth)
          var start = new google.maps.Marker({
                            position: startPosition,
                            map: map,
                            title : start_title
                          });
          var end = new google.maps.Marker({
                          position: endPosition,
                          map: map,
                          title : end_title
                        });
              
          var request = {
                      origin:startPosition,
                      destination:endPosition,
                      // if u wanna show waypoints in the route use below code
                      //waypoints : [{location: new google.maps.LatLng(6.9237284, 79.87322849999998)}],   
                      waypoints : wypoints,               
                      travelMode: google.maps.TravelMode.DRIVING
                  };
            

          directionsService2.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay2.setDirections(response);
               }
            });

           $scope.map_position = map;
          directionsDisplay2.setMap(map);
       });

    };

    function placeMarkerPosition(position, map) {
      //var markerId = getMarkerUniqueId(position.lat(), position.lng());
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          //id : markerId
        });
        deleteMarkers();
        markers.push(marker);
        $scope.reservationPosition = {latitude : markers[0].position.k, longitude : markers[0].position.D};
        console.log($scope.reservationPosition);
        //map.panTo(position);
        bindMarkerEvents(marker);
    };

    function deleteMarkers() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
        $scope.reservationPosition = undefined;
    };

    var bindMarkerEvents = function(marker) {
          google.maps.event.addListener(marker, "rightclick", function (point) {
            deleteMarkers();  
          });
    };

    $ionicModal.fromTemplateUrl('templates/passengers.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modalPassengers = modal;
    });

    $scope.closeViewPassengers = function() {
      $scope.modalPassengers.hide();
    };


    $scope.ridePassengers =[];
    $scope.viewPassengers = function(){
      if (UserFactory.signedIn()){
        var promise = RideFactory.viewPassengers(RideFactory.currentRide.ride_id);
        console.log('view passengerrrrrrrrrrrsssssssssssss')
        promise.then(function(){
          console.log('before loop')
          console.log(RideFactory.passengers)
          var ii=0;
          for(var i= 0; i<RideFactory.passengers.length ; i++){
            console.log('loooopppppppppp' + i)
            console.log(RideFactory.passengers[i].user_id)
            var id_ = RideFactory.passengers[i].ride_id;
            //var promise1 = UserFactory.getUserById(RideFactory.passengers[i].user_id);

             //promise1.then(function(data){

                // $scope.ridePassengers[ii] = {id : ii,
                //                           ride_id : id_,
                //                           user_id : data.data.user_id,
                //                           user_name : data.data.user_name,
                //                           first_name : data.data.first_name,
                //                           last_name : data.data.last_name,
                //                           tel_no : data.data.telephone,
                //                           start_location : data.data.start_location};
                  $scope.ridePassengers[ii] = {id : ii,
                                          ride_id : id_,
                                          user_id : RideFactory.passengers[i].User.user_id,
                                          user_name : RideFactory.passengers[i].User.user_name,
                                          first_name : RideFactory.passengers[i].User.first_name,
                                          last_name : RideFactory.passengers[i].User.last_name,
                                          tel_no : RideFactory.passengers[i].User.telephone,
                                          start_location : RideFactory.passengers[i].User.location};

                ii = ii + 1;
                console.log($scope.ridePassengers[ii])
            //   //$scope.ridePassengers.push(ride_id : RideFactory.passengers[0].ride_id);
            // });
          }  
          console.log($scope.ridePassengers);
          $scope.modalPassengers.show();
        });
      }
    };

    // ******************************************************


    $scope.loadRide = function() {
      var ride_id = $stateParams.rideId;
      var editable = $stateParams.editable;
      
      $scope.currentRideId = ride_id;

        if (ride_id !== undefined){


            RideFactory.getRideByRideId(ride_id).then(
              function(data){
                RideFactory.currentRide = data.data;
                $scope.rideDetails = data.data;
                console.log($scope.rideDetails)
                $scope.rideAuthor = RideFactory.currentRide.user_id;
                $scope.currentUserr = UserFactory.currentUser.user_id;
                $scope.currentRideId = RideFactory.currentRide.ride_id;
                //loadMap();
                var rendererOptions = {};

                if(editable !== 'false')
                {

                  rendererOptions = {

                    draggable: true
                  };

                }

                loadMap(rendererOptions, editable);
                //google.maps.event.addDomListener(window, 'load', loadMap);
              },
              function(){
                alert('error');
              });
        }
        else
        {
          $scope.error_message = 'Select a ride to load';
        }
      };

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;



    // this function is used to load the map details on the page. It uses route information saved in the database
    function loadMap (rendererOptions, editable){
      //alert()
        
        if (rendererOptions !== undefined) {
          
          directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        }
        else {
          directionsDisplay = new google.maps.DirectionsRenderer();
        }

        var myLatlng = new google.maps.LatLng($scope.rideDetails.start_lattitude, $scope.rideDetails.start_longitude);
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        $scope.map = map; 
        directionsDisplay.setMap(map);

        var startPosition = new google.maps.LatLng($scope.rideDetails.start_lattitude, $scope.rideDetails.start_longitude);
        var endPosition = new google.maps.LatLng($scope.rideDetails.end_latitude, $scope.rideDetails.end_longitude);
        var wypoints = [];

        //for(var i =0 ; i< $scope.rideDetails.RideCordinates.lenth; i ++)
        for (key in $scope.rideDetails.RideCordinates) {        
          //waypoints.push(new google.maps.LatLng($scope.rideDetails.RideCordinates[i].latitude, $scope.rideDetails.RideCordinates[i].longitude);

            wypoints.push({
          location:new google.maps.LatLng($scope.rideDetails.RideCordinates[key].latitude, $scope.rideDetails.RideCordinates[key].longitude),
          stopover:false});
        }


        var start_title = $scope.rideDetails.from_location;
        var end_title = $scope.rideDetails.to_location;
        //console.log(wypoints.lenth)
        var start = new google.maps.Marker({
                          position: startPosition,
                          map: map,
                          title : start_title
                        });
              var end = new google.maps.Marker({
                          position: endPosition,
                          map: map,
                          title : end_title
                        });
              
                  var request = {
                      origin:startPosition,
                      destination:endPosition,
                      // if u wanna show waypoints in the route use below code
                      //waypoints : [{location: new google.maps.LatLng(6.9237284, 79.87322849999998)}],   
                      waypoints : wypoints,               
                      travelMode: google.maps.TravelMode.DRIVING
                  };
            

          directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setDirections(response);
                  //var route_names = directionsDisplay.getDirections();


                }
              });
        $scope.map = map; 
        directionsDisplay.setMap(map);



        if(UserFactory.currentUser.user_id === $scope.rideDetails.user_id){
          //***************************
          console.log('*********************1111111111111111*************************')
          for (key in $scope.rideDetails.RiderInfoes) {  
            var pLatlng = new google.maps.LatLng($scope.rideDetails.RiderInfoes[key].start_latitude,$scope.rideDetails.RiderInfoes[key].start_longitude);

            placePassengerMarker(pLatlng, map, ($scope.rideDetails.RiderInfoes[key].User.first_name+ ' '+ $scope.rideDetails.RiderInfoes[key].User.last_name));

            console.log('******************22222222*****************************')
          }
        }
        console.log('************************333333333333****************************')
        //$scope.map = map;

        if ((rendererOptions !== undefined) && (editable !== 'false')) {
          google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
            var result = directionsDisplay.getDirections();

            var myroute = result.routes[0];
            $scope.startLatitude = myroute.legs[0].start_location.k;
            $scope.startLongitude = myroute.legs[0].start_location.D;
            $scope.endLatitute = myroute.legs[0].end_location.k;
            $scope.endLongitude = myroute.legs[0].end_location.D;

            $scope.editRouteData = {startLatitude: myroute.legs[0].start_location.k, 
                                    startLongitude : myroute.legs[0].start_location.D, 
                                    endLatitude: myroute.legs[0].end_location.k, 
                                    endLongitude: myroute.legs[0].end_location.D};
            var wypoints_edited = [];


            for (var i = 0; i < myroute.legs[0].via_waypoint.length; i++) {

              wypoints_edited.push({
              location:new google.maps.LatLng(myroute.legs[0].via_waypoint[i].location.k, myroute.legs[0].via_waypoint[i].location.D),
              stopover:true});
            }

            $scope.waypoints = directionsDisplay.directions.routes[0].legs[0].via_waypoint;

          });
        }


    };

     function placePassengerMarker(position, map, title) {
        //var markerId = getMarkerUniqueId(position.lat(), position.lng());
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          title : title
          //draggable:true,
          //id: 'marker_' + markerId
        });
      }
    
    // the user who entered the Ride can edit ride information
    $scope.editRide = function() {

      $scope.editRouteData = {startLatitude: $scope.startLatitude, startLongitude : $scope.startLongitude, endLatitude: $scope.endLatitute, endLongitude: $scope.endLongitude};

     // if (UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) {

        var delete_waypoints = false;
        if (($scope.rideDetails.RideCordinates.length === $scope.waypoints.length) ) {
          for (var i = 0; i < $scope.rideDetails.RideCordinates.length; i++) {

            if (($scope.rideDetails.RideCordinates[i].latitude !== $scope.waypoints[i].location.k)
                 ||($scope.rideDetails.RideCordinates[i].longitude !== $scope.waypoints[i].location.D)) {
              //$scope.rideDetails.RideCordinates[i].latitude = $scope.waypoints[i].location.k;
              //$scope.rideDetails.RideCordinates[i].longitude = $scope.waypoints[i].location.D;
              console.log('DATA ADDED!!')
              delete_waypoints = true;
            }

          }
        }
        else
        {
          console.log('nothing for now')
          delete_waypoints = true;
          // here try to delete the records and then call insert again for waypoints
        }



        var promise =RideFactory.editRide($scope.rideDetails, $scope.editRouteData);
        console.log('COME HERE AFTER EDITING ONCEEEEE')
        promise.then(function(){
          if ($scope.waypoints !== null)
          {

            if (delete_waypoints === true){
              var promise = RideFactory.deleteWaypoints($scope.rideDetails.ride_id);
              for(var i= 0; i<$scope.waypoints.length ; i++){
                var waypoint_edit = {ride_id : $scope.rideDetails.ride_id, latitude :$scope.waypoints[i].location.k, longitude: $scope.waypoints[i].location.D}
                  var promise_waypoits = RideFactory.addRideCordinates($scope.waypoints[i]);
                  // promise_waypoits.then(function(){

                  
                  // });
              }
            }
              var path = '/app/ride/'+ RideFactory.currentRide.ride_id + '/' + false;
                  $location.path(path);
          }
          var path = '/app/ride/'+ RideFactory.currentRide.ride_id + '/' + false;
          $location.path(path);
        });

      // }
      // else {
      //   $scope.error_message = 'you do not have the permission to edit this Ride information';
      // }

    };

    // theuser who enteres the Ride can delete the ride
    $scope.deleteRide = function (){
      var Id = $stateParams.rideId;
      console.log($stateParams.rideId)
      if (UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) {
        $ionicPopup.confirm({
                title: "Delete Ride",
                content: "Are you sure you want to delete this ride?"
              })
              .then(function(result) {
                if(result) {
                    var promise = RideFactory.deleteRide(Id);
                    promise.then(function(){
                    console.log('deleted data');
                    var path = '/app/findride/';
                    $location.path(path);
                  });
                }
              });
      }
      else {
        $scope.error_message = 'you do not have the permission to edit this Ride information';
        $ionicPopup.alert({
           title: 'Delete!',
           template: 'You dont have permission to delete ride information'
         });
         alertPopup.then(function(res) {
           console.log('You dont have permission to delete ride information');
       });

      }
    };


    // show the dialog to enter joining position once the user joins a ride
    $scope.joinRide = function(){
      if (UserFactory.signedIn()) { 
        $scope.modalPosition.show();
      }
      else{
        $scope.modal.show();
      }

    };

    // a passenger can join a ride 
    $scope.insertRider = function(){
      console.log($scope.reservationPosition)
      if (UserFactory.signedIn()) { 
        //var promise = Reservation.joinRide(UserFactory.currentUser.user_id, $scope.rideDetails);
        var promise = Reservation.joinRide($scope.reservationPosition);
         promise.then(function(){

          $scope.currentRider = Reservation.currentRes.user_id;
          $scope.rideDetails.available_seats = $scope.rideDetails.available_seats - 1 ;
          var promise1 = RideFactory.editRide($scope.rideDetails);
          promise1.then(function(){
            console.log('reduced seats') 
            console.log(RideFactory.currentRide.ride_id)
            $scope.currentRideId = RideFactory.currentRide.ride_id;

            $scope.modalPosition.hide();
          });
         });
      }
      else
      {
        $scope.modal.show();

      }

    };

    // a passenger can leave a Ride that he/she has joined
    $scope.leaveRide = function(){
      if (UserFactory.signedIn()) {
        var promise = Reservation.leaveRide(RideFactory.currentRide.ride_id, UserFactory.currentUser.user_id);

        promise.then(function(){
          $scope.rideDetails.available_seats = $scope.rideDetails.available_seats + 1 ;

          var promise1 = RideFactory.editRide($scope.rideDetails);

          promise1.then(function(){
            $scope.currentRideId = RideFactory.currentRide.ride_id;
          });
        });
      }
    };
})