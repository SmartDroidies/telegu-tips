'use strict';

/* Filters */

var telegutipsFilters = angular.module('telegutipsFilters',  []);

telegutipsFilters.filter('feedicon', function($filter) {
	return function(input) {
		var start = "src=\"";
		var end = "\"";
		var temp = input.substring(input.indexOf(start)+5);
		var imageSrc = temp.substring(0,temp.indexOf(end));
		return '<img class="tip-icon-img" src=' +  imageSrc + '>' ; 
	};
});