app.factory('Auth', function ($rootScope, User) {

    var authUser = {};

    var Auth = {
        register: function (user) {
            return User.Create(user);                    
        },

        login: function (user) {
            // write a method in server to check for password and svalidate login user.. and return the user object
            return auth.$login('password', user);
        },

        logout: function () {
            // call a method in server? 
            // or simply clear the AuthUser?
            User.currentUser = null;
        },

        signedIn: function () {
            // this returns True or False
            return User !== null;
        }
    };

    return Auth;
});

