angular.module('starter.controllers', [])

.factory('UserFactory', ['$http', '$rootScope', '$q', '$ionicModal', 'RIDESHARE_URL', function($http, $rootScope, $q, $ionicModal, RIDESHARE_URL) {


    var urlBase = RIDESHARE_URL + 'api/user'; 
    //var urlBase ='http://localhost/api/user';
    //var urlBase = 'http://192.168.43.70/api/user';
    //var urlBase = 'http://localhost/ARideShare/api/user';
    var User = {};
    User.currentUser = {};


    User.getUserById = function (user_id_) {
        return $http.get(urlBase, {params: {user_id : user_id_} });
    };

    User.getUserByToken = function (token) {
        return $http.get(urlBase, {params: {user_name : token.name, token : token.token} })
            .success(function(data, status, headers, config) {
                    setCurrentUser(data);
                  }).
                  error(function (data, status, headers, config) {
                    User.currentUser = undefined;
          });
    };

    User.getUser = function (user_name, password) {
        
        var deferred = $q.defer();
        $http.get(urlBase, {params: {user_name : user_name, password : password}})
        .success(function(data, status, headers, config) {
                setCurrentUser(data);
                deferred.resolve(data);
              }).
              error(function (data, status, headers, config) {
                User.currentUser = undefined;
                deferred.reject(data);
      });
      return deferred.promise;                  
    };

    User.insertUser = function (user) {

        var deferred = $q.defer();

         return $http.post(urlBase, {
                first_name : user.firstName,
                last_name : user.lastName,
                user_name : user.username,
                gender : user.gender,
                password : user.password,
                email : user.email,
                location : user.location,
                telephone : user.telephone
            }).
              success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                User.currentUser = data;
                setCurrentUser(User.currentUser);
                deferred.resolve(data);
              }).
              error(function (data, status, headers, config) {
                User.currentUser = undefined;
                setCurrentUser(User.currentUser);
                deferred.reject(data);
            });
            //return deferred.promise;
    };

    User.updateUser = function (user) {   
        var deferred = $q.defer();
        $http.put(urlBase + '/' + user.user_id, user)
        .success(function(data, status, headers, config) {
                console.log(data);
                User.currentUser = user;
                console.log('success');

                deferred.resolve(data);
              }).
              error(function (data, status, headers, config) {
                console.log('error: ' );
                deferred.reject(data);
      });
      return deferred.promise; 
    };

    User.deleteUser = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    User.signedIn = function () {
        return $rootScope.currentUser !== undefined;
    };

    User.getCurrentLocatoin = function () {
      var deferred = $q.defer();
      var startPos;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            startPos = position;
            var latitude = startPos.coords.latitude;
            var longitude  = startPos.coords.longitude;

            $rootScope.position = startPos;
            deferred.resolve(startPos);
          }, function(error) {
            deferred.reject(error);
           // alert("Error occurred. Error code: " + error.code);
            // error.code can be:
            //   0: unknown error
            //   1: permission denied
            //   2: position unavailable (error response from locaton provider)
            //   3: timed out
          });

          navigator.geolocation.watchPosition(function(position) {
            var currLat = position.coords.latitude;
            var currLong = position.coords.longitude;    
             $rootScope.currPosition = position;
            deferred.resolve(position);       
          });

        }
        return deferred.promise;
    };

    var setCurrentUser = function(user) {
        $rootScope.currentUser = user.user_name;   
        User.currentUser = user; 
    };
    return User;
}])
