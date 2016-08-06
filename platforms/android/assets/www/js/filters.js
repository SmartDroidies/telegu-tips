'use strict';

/* Filters */

var telegutipsFilters = angular.module('telegutipsFilters',  []);

telegutipsFilters.filter('feedicon', function($filter,$log) {
	return function(input) {
		var start = "src=\"";
		var end = "\"";
		if(input) {
			var temp = input.substring(input.indexOf(start)+5);
			var imageSrc = temp.substring(0,temp.indexOf(end));
			return '<img class="tip-icon-img" src=' +  imageSrc + '>' ; 
		} else {
			$log.warn("Iput Empty : " + input);
		}
	};
});
//08022016
telegutipsFilters.filter('toLongDate', function($filter) {
	return function(input) {
		var _date = $filter('date')(new Date(input), 'MMM d, y h:mm a');
		return _date; 
	};
});
telegutipsFilters.filter('breaklines', function($filter) {
	return function(input) {
		if (!input) return input;
   		return input.replace(/\n\r?/g, '<br />');
	};
});