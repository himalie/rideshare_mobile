
angular.module('starter')
.factory('GoogleMaps', ['$rootScope', function($rootScope) {
  var maps = {};

  function addMap(mapId) {
    maps[mapId] = {};
  }
  function getMap(mapId) {
    if (!maps[mapId]) addMap(mapId);
    return maps[mapId];
  }

  return {
    addMap: addMap,
    getMap: getMap
  }
}]);