angular.module('starter')
    .filter('removeLastNode', function() {
        return function(input) {        	
            var arr = input.split(',').slice(0, -1);
            return arr.join(", ");
        }
    });