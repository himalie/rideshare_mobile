angular.module('starter.controllers', [])

.factory('UserFactory', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

    var urlBase = 'http://localhost/ARideShare/api/user';
    var User = {};

    User.currentUser = {};

    User.getUsers = function () {
        return $http.get(urlBase);
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
                User.currentUser = null;
                console.log('error: ' + data);
                deferred.reject(data);
      });
        return deferred.promise;

// =============================
        // $http.get(urlBase, {params: {user_name : user_name, password : password}})
        //             .then(function(data, status, headers, config) {
        //                 if (typeof data.data === 'object') {
        //                     console.log(' SERVICE data :'+data);
        //                     User.currentUser = data;
        //                     console.log('SERVICE User.currentUser.user_name' + User.currentUser.user_name);
        //                     setCurrentUser(User.currentUser.user_name);
        //                     return $q.resolve(data.data);
        //                 } else {
        //                     // invalid response
        //                     return $q.reject(data.data);
        //                 }

        //             }, function(data) {
        //                 // something went wrong
        //                 return $q.reject(data.data);
        //             });

// =====================================================================================

      //   $http.get(urlBase, {params: {user_name : user_name, password : password}}).
      //         success(function(data, status, headers, config) {
      //           // this callback will be called asynchronously
      //           // when the response is available
      //           console.log('SERVICE come hereeee');
      //           console.log(data);
      //           User.currentUser = data;
      //           console.log('SERVICE User.currentUser ='+ User.currentUser.user_name);
      //           setCurrentUser(User.currentUser.user_name);
      //           return data;
      //         }).
      //         error(function (data, status, headers, config) {
      //           User.currentUser = null;
      //           console.log('error: ' + data);
      // });
                  
    };

    User.insertUser = function (user) {

        var deferred = $q.defer();

         $http.post(urlBase, {
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
                User.currentUser = null;
                setCurrentUser(User.currentUser.user_name);
                console.log('error: ' + data);
                deferred.reject(data);
            });
              return deferred.promise;
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

    setCurrentUser = function(username) {
        console.log('SERVICE set curr user :'+ username);
        $rootScope.currentUser = username;

        //User.currentUser = User.findByUsername(username);
    };
    return User;
}])


.factory('User', function ($rootScope, $http) {

    var User = {
        currentUser : {},

        create: function (authUser, username, email) {
            
            
            // insert a record here? like below

            $http.post('http://localhost/api/user', {
                first_name : user.first_name,
                last_name : user.last_name,
                user_name : user.user_name,
                gender : user.gender,
                password : user.password,
                email : user.email,
                location : user.location
            }).
              success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                setCurrentUser(username);
                console.log(data);
                return data;
              })
            
        },


        // here is there a problem with semicolons??

        findByUsername: function (username) {
            if (username) {
                console.log(username);
               return  $http.get('http://localhost/ARideShare/api/user', {params: {user_name : username}}).
                  success(function(data, status, headers, config) {
                      console.log(data);
                      setCurrentUser(username);
                    }); 
                  //return user;
                }
            
        },


        signedIn: function () {
            return $rootScope.currentUser !== undefined;
        }
    };

    function setCurrentUser (username) {
        $rootScope.currentUser = username;
        User.currentUser = User.findByUsername(username);
    }
    
    return User;
});