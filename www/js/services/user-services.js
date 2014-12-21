angular.module('starter.controllers', [])

.factory('UserFactory', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

    var urlBase = 'http://localhost/ARideShare/api/user';
    var User = {};

    User.currentUser = {};


    User.getUserById = function (user_id_) {
        console.log('gggggggggggggggggggggggggggg')
        return $http.get(urlBase, {params: {user_id : user_id_} });
    };

    User.getUser = function (user_name, password) {
        console.log('come here');
        
        var deferred = $q.defer();
        $http.get(urlBase, {params: {user_name : user_name, password : password}})
        .success(function(data, status, headers, config) {
                console.log(data);
                User.currentUser = data;
                console.log('SERVICE User.currentUser ='+ User.currentUser.user_name);
                setCurrentUser(User.currentUser.user_name);
                deferred.resolve(data);
              }).
              error(function (data, status, headers, config) {
                User.currentUser = undefined;
                //$scope.error = error;
                console.log('error: ' + data);
                console.log(data.data)
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
                location : user.location
            }).
              success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                User.currentUser = data;
                setCurrentUser(User.currentUser.user_name);
                console.log('POST SERVICE='+ data);
                deferred.resolve(data);
              }).
              error(function (data, status, headers, config) {
                User.currentUser = undefined;
                setCurrentUser(User.currentUser.user_name);
                console.log('error: ' + data);
                deferred.reject(data);
            });
            //return deferred.promise;
    };

    User.updateUser = function (user) {
        return $http.put(urlBase + '/' + user.user_id, user);
    };

    User.deleteUser = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    User.signedIn = function () {
        console.log(' signedIn');
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
            console.log('###### '+ latitude+ '');
            console.log('###### '+ longitude+ '');
            $rootScope.position = startPos;
            deferred.resolve(startPos);
          }, function(error) {
            deferred.reject(error);
            alert("Error occurred. Error code: " + error.code);
            // error.code can be:
            //   0: unknown error
            //   1: permission denied
            //   2: position unavailable (error response from locaton provider)
            //   3: timed out
          });

          navigator.geolocation.watchPosition(function(position) {
            var currLat = position.coords.latitude;
            var currLong = position.coords.longitude;  
            console.log('######@@@ '+ currLat+ '');
            console.log('######@@@ '+ currLong+ '');   
             $rootScope.currPosition = position;
            deferred.resolve(position);       
          });

        }
        return deferred.promise;
    };

    setCurrentUser = function(username) {
        console.log('SERVICE set curr user :'+ username);
        $rootScope.currentUser = username;

        //User.currentUser = User.findByUsername(username);
    };
    return User;
}])
