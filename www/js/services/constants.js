
angular.module('starter.controllers',[])

.service('Constants',[function(){
  	
  var _API = {
  	baseUrl: "http://localhost/api"
  }


  var _timeouts = {
    collection: {
      user : 0
    }
  }
  
  var constants = {
    DEBUGMODE : false,
    SHOWBROADCAST_EVENTS : true,
    API: _API,
    //IMG: _img,
    timeouts: _timeouts
  };

  return constants;
}])