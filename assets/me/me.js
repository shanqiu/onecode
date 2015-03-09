'use strict';

angular.module('myApp.me', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/me', {
    templateUrl: '/me/me.html',
    controller: 'MeController'
  });
}])

.controller('MeController', function($scope,$http,$log){
	//$log is used for console log in Angular js
	//$http is used to communicate with the server 
	//$scope defines the scope of controller
	$scope.me = new Object();
	$http.get("http://localhost:1337/api/users/me")
		 .success(function(data){
		 	$scope.me=data;
		 	$log.info($scope.me);
		 });


});