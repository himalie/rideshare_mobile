
angular.module('starter')

.factory('Auth', ['$http', '$rootScope', 'UserFactory', '$window', function($http, $rootScope, UserFactory, $window) {

    var Auth = {};

    Auth.setCookie = function(){

        var rand = function() {
            return Math.random().toString(36).substr(2); // remove `0.`
        };

        var token = function() {
            return rand(); // to make it longer
        };

        var value = {name : UserFactory.currentUser.user_name ,
                     token : token()};
        $window.localStorage['authorized'] = JSON.stringify(value);
        UserFactory.currentUser.token = value.token;
        UserFactory.updateUser(UserFactory.currentUser);
    }

    Auth.deleteCookie = function(){
        $window.localStorage.clear();
    };


    Auth.getCookie = function(cookie){
        if($window.localStorage[cookie] !== undefined){
         return JSON.parse($window.localStorage[cookie]);
     }
    }

    Auth.login = function() {
      var authCookie = Auth.getCookie('authorized')
      if(authCookie){
        return UserFactory.getUserByToken(authCookie);
      }     
    };

    return Auth;
}])

