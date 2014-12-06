app.factory('User', function (Auth, $rootScope) {

    var User = {
        currentUser : {},

        create: function (authUser, username, email) {
            

            setCurrentUser(username);

            return user.$loaded(function () //noinspection JSHint
            {
                user.username = username;
                user.email = email;
                user.md5_hash = authUser.md5_hash;
                user.$priority = authUser.uid;
                user.$save();
            });
        },

        findByUsername: function (username) {
            if (username) {
                $http.get('http://localhost/api/user', {params: {user_name : username}).
			      success(function(data, status, headers, config) {
			          return data;
			    });
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