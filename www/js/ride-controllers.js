angular.module('starter')

.controller('AddRideCtrl', function($scope, $ionicModal, $ionicLoading, $compile, $rootScope, RideFactory, $location, UserFactory) {

  $scope.rides = [
    { id: 1, from: 'Gampola', to: 'Kandy'},
    { id: 2, from: 'Peradeniya', to: 'Kandy'},
    { id: 3, from: 'Pilimatalawa', to: 'Kandy'},
    { id: 4, from: 'Gampola', to: 'Colombo'},
    { id: 5, from: 'Katugastota', to: 'Kurunegala'},
    { id: 6, from: 'Katugastota', to: 'Kandy'}
  ];


    $scope.rideData = {};
    $scope.addRide = function(){

      var promise = RideFactory.addRide($scope.rideData, $scope);
      if (promise)
      {
        promise.then(function(){
          console.log('added ride to db');
          if ($scope.waypoints !== undefined)
          {
            console.log('have way points');
            console.log($scope.waypoints.length);

            for(var i= 0; i<$scope.waypoints.length ; i++){
              var promise_waypoits = RideFactory.addRideCordinates($scope.waypoints[i]);
              promise_waypoits.then(function(){
              console.log('added waypoints');
              var path = '/app/ride/'+ RideFactory.currentRide.ride_id;
              $location.path(path);
              });
            }
          }
          var path = '/app/ride/'+ RideFactory.currentRide.ride_id;
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
            //console.log(" ddd "+ UserFactory.currentUser.first_name);
            $scope.modal.show();
          };

          var path = '/app/ride/';
          console.log('promise false');
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
        console.log('^^^^^^^^^^ '+myLatlng);
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
          console.log('drag route');
          console.log(directionsDisplay.getDirections());
          console.log(directionsDisplay.getDirections().routes[0]);
          $scope.myroute = directionsDisplay.getDirections();
          console.log('££££'+directionsDisplay.getDirections().routes[0].legs[0].start_address);
          console.log(directionsDisplay.getDirections().routes[0].legs[0].end_address);
          $scope.waypoints = directionsDisplay.directions.routes[0].legs[0].via_waypoint;
          //computeTotalDistance(directionsDisplay.getDirections());
          $scope.startAddress = directionsDisplay.getDirections().routes[0].legs[0].start_address;
          $scope.endAddress = directionsDisplay.getDirections().routes[0].legs[0].end_address
          $scope.startLatitude = directionsDisplay.getDirections().routes[0].legs[0].start_location.k;
          $scope.startLongitude = directionsDisplay.getDirections().routes[0].legs[0].start_location.D;
          $scope.endLatitute = directionsDisplay.getDirections().routes[0].legs[0].end_location.k;
          $scope.endLongitude = directionsDisplay.getDirections().routes[0].legs[0].end_location.D;

          console.log('$$$$$$$$$$$'+ $scope.endAddress);

        });
        
        google.maps.event.addListener(map, 'click', function(e) {
         // infowindow.open(map,marker);
         console.log('ggggggggg');
         console.log(e);

          placeMarker(e.latLng, map);
          console.log(markers.length);
          if (markers.length ===2)
          {
            var fromLocation = new google.maps.LatLng(markers[0].position.lat(),markers[0].position.lng());
            var toLocation = new google.maps.LatLng(markers[1].position.lat(),markers[1].position.lng());
            console.log('come ');
              console.log(markers[0].position.lat());
              console.log(markers[0].position.lng());
              
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
                  console.log('wwwwwwwwwwwwwwwww');
                  directionsDisplay.setDirections(response);
                  var route_names = directionsDisplay.getDirections();
                  console.log(route_names);
                
                  console.log('ddddddddddddddddddddddddddddssssssssssss');
                  //console.log(route_names.destination.D);
                  //console.log(route_names[0].legs[0].end_address);
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
        console.log('clicking port ='+ position.lat());
      console.log(markerId);

        //markers[markerId] = marker; // cache marker in markers object
        //count ++;
        //bindMarkerEvents(marker);

        //console.log(markers[markerId]);

        google.maps.event.addListener(marker, 'dragend', function(){
          alert(marker.getPosition())
            //(marker.getPosition());
        });

        markers.push(marker);
        console.log(count);
        console.log(markers.length);
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
.controller('RideCtrl', function($scope, $ionicLoading, $compile, RideFactory, $rootScope, $location, $stateParams, UserFactory) {
  // $scope.rides = [
  //   { id: 1, from: 'Gampola', to: 'Kandy'},
  //   { id: 2, from: 'Peradeniya', to: 'Kandy'},
  //   { id: 3, from: 'Pilimatalawa', to: 'Kandy'},
  //   { id: 4, from: 'Gampola', to: 'Colombo'},
  //   { id: 5, from: 'Katugastota', to: 'Kurunegala'},
  //   { id: 6, from: 'Katugastota', to: 'Kandy'}
  // ];

   // $scope.map =
    $scope.loadRide = function() {
      var ride_id = $stateParams.rideId;
      console.log(ride_id)
        if (ride_id !== undefined){
            RideFactory.getRideByRideId(ride_id).then(
              function(data){
                
                $scope.rideDetails = data.data;
                console.log($scope.rideDetails.from_location)
                console.log($scope.rideDetails);
                loadMap()
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
    function loadMap (){
      
      console.log('ooooooooooooooooo')
      directionsDisplay = new google.maps.DirectionsRenderer();
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
        console.log($scope.rideDetails.RideCordinates);
        console.log(typeof $scope.rideDetails.RideCordinates)
        //for(var i =0 ; i< $scope.rideDetails.RideCordinates.lenth; i ++)
      for (key in $scope.rideDetails.RideCordinates) 
        {
          //waypoints.push(new google.maps.LatLng($scope.rideDetails.RideCordinates[i].latitude, $scope.rideDetails.RideCordinates[i].longitude);
            wypoints.push({
          location:new google.maps.LatLng($scope.rideDetails.RideCordinates[key].latitude, $scope.rideDetails.RideCordinates[key].longitude),
          stopover:true});
        }
        console.log(wypoints);
        var start_title = $scope.rideDetails.from_location;
        var end_title = $scope.rideDetails.to_location;

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
                  var route_names = directionsDisplay.getDirections();
                  console.log(route_names);
                
                  console.log('ddddddddddddddddddddddddddddssssssssssss');
                  //console.log(route_names.destination.D);
                  //console.log(route_names[0].legs[0].end_address);
                }
              });
        $scope.map = map; 
    };

    $scope.editRide = function() {
      if (UserFactory.currentUser.user_id === RideFactory.currentRide.user_id) {

      }
      else {
        $scope.error_message = 'you do not have the permission to edit this Ride information';
      }

    };
})