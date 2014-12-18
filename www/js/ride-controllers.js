angular.module('starter')

.controller('AddRideCtrl', function($scope, $ionicModal, $ionicLoading, $compile, $rootScope, RideFactory, $location, UserFactory) {

  // $scope.rides = [
  //   { id: 1, from: 'Gampola', to: 'Kandy'},
  //   { id: 2, from: 'Peradeniya', to: 'Kandy'},
  //   { id: 3, from: 'Pilimatalawa', to: 'Kandy'},
  //   { id: 4, from: 'Gampola', to: 'Colombo'},
  //   { id: 5, from: 'Katugastota', to: 'Kurunegala'},
  //   { id: 6, from: 'Katugastota', to: 'Kandy'}
  // ];

    
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
.controller('RideCtrl', function($scope, $ionicLoading, $compile, RideFactory, $rootScope, $location, $stateParams, UserFactory, Reservation) {
  // $scope.rides = [
  //   { id: 1, from: 'Gampola', to: 'Kandy'},
  //   { id: 2, from: 'Peradeniya', to: 'Kandy'},
  //   { id: 3, from: 'Pilimatalawa', to: 'Kandy'},
  //   { id: 4, from: 'Gampola', to: 'Colombo'},
  //   { id: 5, from: 'Katugastota', to: 'Kurunegala'},
  //   { id: 6, from: 'Katugastota', to: 'Kandy'}
  // ];

    $scope.rideDetails = {};
    $scope.reservationData = {};

  $scope.valueD = "fdfdfdfd";

    $scope.rideAuthor = RideFactory.currentRide.user_id;
    $scope.currentUserr = UserFactory.currentUser.user_id;
    
    // $scope.map =
    $scope.loadRide = function() {
      var ride_id = $stateParams.rideId;
      var editable = $stateParams.editable;
      $scope.currentRideId = ride_id;

        if (ride_id !== undefined){


            RideFactory.getRideByRideId(ride_id).then(
              function(data){
                RideFactory.currentRide = data.data;
                $scope.rideDetails = data.data;
                $scope.rideAuthor = RideFactory.currentRide.user_id;
                $scope.currentUserr = UserFactory.currentUser.user_id;
                $scope.currentRideId = RideFactory.currentRide.ride_id;
                //loadMap();
                var rendererOptions = {};
                // if ((UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) 
                //     && (RideFactory.currentRide.status === 'Planned') && (editable !== 'false'))
                //if ((UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) && (editable !=0))
                 //if ((UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) 
                 //   &&  (editable !== 'false'))
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
    //google.maps.event.addDomListener(window, 'load', loadMap);
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

    $scope.deleteRide = function (){
      var Id = $stateParams.rideId;
      console.log($stateParams.rideId)
      if (UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) {
        alert('are you sure u want to delete the ride?')
        var promise = RideFactory.deleteRide(Id);
          promise.then(function(){
          console.log('deleted data');
          var path = '/app/findride/';
          $location.path(path);
        });
      }
      else {
        $scope.error_message = 'you do not have the permission to edit this Ride information';
      }
    };

    $scope.joinRide = function(ride_id_, user_id_){
      //$scope.reservationData.start_lattitude = 
      //$scope.reservationData.end_lattitude =
      console.log(ride_id_)
      console.log(user_id_)
      console.log(UserFactory.currentUser.user_id)
      console.log($scope.rideDetails.ride_id)
      if (UserFactory.signedIn()) { 
        var promise = Reservation.joinRide(UserFactory.currentUser.user_id, $scope.rideDetails);
         promise.then(function(){
          console.log('joined rideeeeeeeeeeee') 
          $scope.rideDetails.available_seats = $scope.rideDetails.available_seats - 1 ;
          var promise1 = RideFactory.editRide($scope.rideDetails);
          promise1.then(function(){
            console.log('reduced seats') 
          });
         });
      }

    };


})