'use strict';

/* Directive */
var telegutipsDirective = angular.module('telegutipsDirective',  []);

telegutipsDirective.directive('formatContent', function() {
	return {
		link: function(scope, element, attr) {
    		//console.log(element);
    		element.css({
        			position: 'relative',
         			cursor: 'pointer',
              align : 'center'
        		});

        element.on('click', function(event) {
            event.preventDefault();
        });
  	 	}
  	};
});
