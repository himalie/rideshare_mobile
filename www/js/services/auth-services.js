
angular.module('starter')

.factory('Auth', ['$http', '$rootScope', 'ipCookie' , 'UserFactory', function($http, $rootScope, ipCookie, UserFactory) {

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

        ipCookie('authorized', value, { expires: 30000 });
        UserFactory.currentUser.token = value.token;
        UserFactory.updateUser(UserFactory.currentUser);
    }

    Auth.deleteCookie = function(){
        ipCookie.remove('authorized');
    };


    Auth.getCookie = function(cookie){
        return ipCookie(cookie);
    }

    Auth.login = function() {

      var authCookie = Auth.getCookie('authorized')
      console.log(typeof authCookie)
      if(authCookie){
        console.log(UserFactory.currentUser)
        console.log('*8888888888888888888888888888888888')
        //autoLog(authCookie);
        return UserFactory.getUserByToken(authCookie);
      }     
    };

    return Auth;
}])

