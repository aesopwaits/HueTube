'use strict';

angular.module("wemo",["ng"]).directive("wemo",function(){
	return{
		restrict:"EA",
		replace:!0,
		scope:{model:"=",toggle:"="},
	    templateUrl: 'templates/wemo.html'
	}
});