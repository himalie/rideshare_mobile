angular.module('starter')
    .filter('removeLastNode', function() {
        return function(input) {
            var arr = input.split(',').pop();
            return arr.join(", ");
        }
    });