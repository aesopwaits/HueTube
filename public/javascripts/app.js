'use strict';

var app = angular.module('smartHomeApp', ['ngRoute','light','colorpicker','group','brightness','wemo']).
 
  config(['$routeProvider', function($routeProvider,SmartHomeController) {
 
    $routeProvider.when('/', { controller: 'SmartHomeController'});
 
    $routeProvider.otherwise({redirectTo: '/'});
 
  }]);