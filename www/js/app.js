// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.constant('RIDESHARE_URL', 'http://localhost/')

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
            $ionicPopup.confirm({
                title: "Internet Disconnected",
                content: "The internet is disconnected on your device."
              })
              .then(function(result) {
                if(!result) {
                    ionic.Platform.exitApp();
                  }
                });
              }
          }
  });
})



.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.defaults.useXDomain = true;﻿
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.headers.common["Accept"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

 // $routeProvider
 //            .when('/', {
 //                templateUrl: '../templates/menu.html',
 //                controller: 'UserCtrl'
 //            })
 //            .otherwise({
 //                redirectTo: '/'
 //            });
  
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'UserCtrl'
    })

    .state('app.findride', {
      url: "/findride",
      views: {
        'menuContent' :{
          templateUrl: "templates/findride.html",
          controller: 'RidesCtrl'
        }
      }
    })

    .state('app.addride', {
      url: "/addride",
      views: {
        'menuContent' :{
          templateUrl: "templates/addride.html",
          controller: 'AddRideCtrl'
        }
      }
    })

    .state('app.register', {
      url: "/register",
      views: {
        'menuContent' :{
          templateUrl: "templates/register.html",
          controller: 'RegisterCtrl'
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })

    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/settings.html",
          controller: 'UserCtrl'
          //controller : 'UserCtrl
        }
      }
    })

    .state('app.user', {
      url: "/user/:userId",
      views: {
        'menuContent' :{
          templateUrl: "templates/user.html",
          controller: 'UserCtrl'
        }
      }
    })

    .state('app.ride', {
      url: "/editride/:rideId/:editable",
      views: {
        'menuContent' :{
          templateUrl: "templates/editride.html",
          controller: 'RideCtrl'
        }
      }
    })

    .state('app.edituser', {
      url: "/edituser/:rideId",
      views: {
        'menuContent' :{
          templateUrl: "templates/editprofile.html",
          controller: 'UserCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/ride/:rideId/:editable",
      views: {
        'menuContent' :{
          templateUrl: "templates/ride.html",
          controller: 'RideCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/findride');
});



