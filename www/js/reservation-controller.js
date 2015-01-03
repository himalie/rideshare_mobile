angular.module('starter')

.controller('ReservationCtrl', function($scope, $ionicModal, $ionicLoading, $compile, $rootScope,$location, $stateParams, Reservation,  RideFactory, $location, UserFactory) {

	$scope.currentUserr = UserFactory.currentUser.user_id;
	$scope.reservationData = {};
	 $scope.rideDetails = {};

	$scope.markPosition = function(){
		var ride_id = $stateParams.rideId;
      var editable = $stateParams.editable;
      $scope.currentRideId = ride_id;
		if (UserFactory.signedIn()) { 
			var promise = Reservation.joinRide($scope.reservationData);
			 promise.then(function(){
			 	RideFactory.getRideByRideId(ride_id).then(
              function(data){
                RideFactory.currentRide = data.data;
                $scope.rideDetails = data.data;
                $scope.rideAuthor = RideFactory.currentRide.user_id;
                $scope.currentUserr = UserFactory.currentUser.user_id;
                $scope.currentRideId = RideFactory.currentRide.ride_id;
                var rendererOptions = {};
                initialize();
              },
              function(){
                // alert('error');
              });
			 });
		}

	};

 function initialize() {  
        directionsDisplay = new google.maps.DirectionsRenderer();    
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
          $scope.startAddress = directionsDisplay.getDirections().routes[0].legs[0].start_address;
          $scope.endAddress = directionsDisplay.getDirections().routes[0].legs[0].end_address
          $scope.startLatitude = directionsDisplay.getDirections().routes[0].legs[0].start_location.k;
          $scope.startLongitude = directionsDisplay.getDirections().routes[0].legs[0].start_location.D;
          $scope.endLatitute = directionsDisplay.getDirections().routes[0].legs[0].end_location.k;
          $scope.endLongitude = directionsDisplay.getDirections().routes[0].legs[0].end_location.D;


        });
        
        google.maps.event.addListener(map, 'click', function(e) {
         // infowindow.open(map,marker);


          placeJoinMarker(e.latLng, map);
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


    function placeJoinMarker(position, map) {
        var markerId = getMarkerUniqueId(position.lat(), position.lng());
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          draggable:true,
          //id: 'marker_' + markerId          
        });


        google.maps.event.addListener(marker, 'dragend', function(){
          alert(marker.getPosition())
            //(marker.getPosition());
        });

        markers.push(marker);

         // for (var i = 0; i < markers.length; i++) {
         //     //markers[i].setMap(map);
         //     console.log( markers[i].position.lat());
         //     console.log( markers[i].position.lng());
         //  }
        map.panTo(position);
      };
      
})