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
                console.log($scope.rideDetails)
                $scope.rideAuthor = RideFactory.currentRide.user_id;
                $scope.currentUserr = UserFactory.currentUser.user_id;
                $scope.currentRideId = RideFactory.currentRide.ride_id;
                //loadMap();
                var rendererOptions = {};
                initialize();
                // if ((UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) 
                //     && (RideFactory.currentRide.status === 'Planned') && (editable !== 'false'))
                //if ((UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) && (editable !=0))
                 //if ((UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) 
                 //   &&  (editable !== 'false'))


                //loadMap(rendererOptions, editable);
                //google.maps.event.addDomListener(window, 'load', loadMap);
              },
              function(){
                alert('error');
              });
			 });
		}

	};

	// $scope.loadRide = function() {
 //      var ride_id = $stateParams.rideId;
 //      var editable = $stateParams.editable;
      
 //      $scope.currentRideId = ride_id;

 //        if (ride_id !== undefined){


 //            RideFactory.getRideByRideId(ride_id).then(
 //              function(data){
 //                RideFactory.currentRide = data.data;
 //                $scope.rideDetails = data.data;
 //                $scope.rideAuthor = RideFactory.currentRide.user_id;
 //                $scope.currentUserr = UserFactory.currentUser.user_id;
 //                $scope.currentRideId = RideFactory.currentRide.ride_id;
 //                //loadMap();
 //                var rendererOptions = {};
 //                // if ((UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) 
 //                //     && (RideFactory.currentRide.status === 'Planned') && (editable !== 'false'))
 //                //if ((UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) && (editable !=0))
 //                 //if ((UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) 
 //                 //   &&  (editable !== 'false'))
 //                if(editable !== 'false')
 //                {

 //                  rendererOptions = {

 //                    draggable: true
 //                  };

 //                }

 //                loadMap(rendererOptions, editable);
 //                //google.maps.event.addDomListener(window, 'load', loadMap);
 //              },
 //              function(){
 //                alert('error');
 //              });
 //        }
 //        else
 //        {
 //          $scope.error_message = 'Select a ride to load';
 //        }
 //      };

 //    var directionsDisplay;
 //    var directionsService = new google.maps.DirectionsService();
 //    var map;



 //    function loadMap (rendererOptions, editable){
 //      //alert()
        
 //        if (rendererOptions !== undefined) {
          
 //          directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
 //        }
 //        else {
 //          directionsDisplay = new google.maps.DirectionsRenderer();
 //        }

 //        var myLatlng = new google.maps.LatLng($scope.rideDetails.start_lattitude, $scope.rideDetails.start_longitude);
 //        var mapOptions = {
 //          center: myLatlng,
 //          zoom: 16,
 //          mapTypeId: google.maps.MapTypeId.ROADMAP
 //        };
 //        var map = new google.maps.Map(document.getElementById("map"),
 //            mapOptions);

 //        $scope.map = map; 
 //        directionsDisplay.setMap(map);

 //        var startPosition = new google.maps.LatLng($scope.rideDetails.start_lattitude, $scope.rideDetails.start_longitude);
 //        var endPosition = new google.maps.LatLng($scope.rideDetails.end_latitude, $scope.rideDetails.end_longitude);
 //        var wypoints = [];

 //        //for(var i =0 ; i< $scope.rideDetails.RideCordinates.lenth; i ++)
 //        for (key in $scope.rideDetails.RideCordinates) {        
 //          //waypoints.push(new google.maps.LatLng($scope.rideDetails.RideCordinates[i].latitude, $scope.rideDetails.RideCordinates[i].longitude);

 //            wypoints.push({
 //          location:new google.maps.LatLng($scope.rideDetails.RideCordinates[key].latitude, $scope.rideDetails.RideCordinates[key].longitude),
 //          stopover:false});
 //        }


 //        var start_title = $scope.rideDetails.from_location;
 //        var end_title = $scope.rideDetails.to_location;
 //        //console.log(wypoints.lenth)
 //        var start = new google.maps.Marker({
 //                          position: startPosition,
 //                          map: map,
 //                          title : start_title
 //                        });
 //              var end = new google.maps.Marker({
 //                          position: endPosition,
 //                          map: map,
 //                          title : end_title
 //                        });
              
 //                  var request = {
 //                      origin:startPosition,
 //                      destination:endPosition,
 //                      // if u wanna show waypoints in the route use below code
 //                      //waypoints : [{location: new google.maps.LatLng(6.9237284, 79.87322849999998)}],   
 //                      waypoints : wypoints,               
 //                      travelMode: google.maps.TravelMode.DRIVING
 //                  };
            

 //          directionsService.route(request, function(response, status) {
 //                if (status == google.maps.DirectionsStatus.OK) {
 //                  directionsDisplay.setDirections(response);
 //                  //var route_names = directionsDisplay.getDirections();


 //                }
 //              });
 //        $scope.map = map; 
 //        directionsDisplay.setMap(map);

 //        if ((rendererOptions !== undefined) && (editable !== 'false')) {
 //          google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
 //            var result = directionsDisplay.getDirections();

 //            var myroute = result.routes[0];
 //            $scope.startLatitude = myroute.legs[0].start_location.k;
 //            $scope.startLongitude = myroute.legs[0].start_location.D;
 //            $scope.endLatitute = myroute.legs[0].end_location.k;
 //            $scope.endLongitude = myroute.legs[0].end_location.D;

 //            $scope.editRouteData = {startLatitude: myroute.legs[0].start_location.k, 
 //                                    startLongitude : myroute.legs[0].start_location.D, 
 //                                    endLatitude: myroute.legs[0].end_location.k, 
 //                                    endLongitude: myroute.legs[0].end_location.D};
 //            var wypoints_edited = [];


 //            for (var i = 0; i < myroute.legs[0].via_waypoint.length; i++) {

 //              wypoints_edited.push({
 //              location:new google.maps.LatLng(myroute.legs[0].via_waypoint[i].location.k, myroute.legs[0].via_waypoint[i].location.D),
 //              stopover:true});
 //            }

 //            $scope.waypoints = directionsDisplay.directions.routes[0].legs[0].via_waypoint;

 //          });
 //        }
 //        console.log('coming to mark position')
 //        markPosition();


 //    };


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


    // function markPosition(map){
    // 	console.log('here at least')
    //     google.maps.event.addListener(map, 'click', function(e) {
    //      // infowindow.open(map,marker);
    //      console.log(e.latLng)
    //       placeJoinMarker(e.latLng, map);
          
    //     });
    //     console.log('afterrrrrrr')
    //     $scope.map = map;
    // };

    function placeJoinMarker(position, map) {
        var markerId = getMarkerUniqueId(position.lat(), position.lng());
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          draggable:true,
          //id: 'marker_' + markerId          
        });

        console.log('comiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
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
      };
      
})