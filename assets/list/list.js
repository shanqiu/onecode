'use strict';

angular.module('myApp.list', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/list', {
    templateUrl: '/list/list.html',
    controller: 'ListController'
  });
}])


.controller('ListController', function($scope,$http,$log){
	//$log is used for console log in Angular js
	//$http is used to communicate with the server 
	//$scope defines the scope of controller
	$scope.list = [];
	$http.get("http://localhost:1337/api/projects")
		 .success(function(data){
		 	$scope.list=data;
		 	$log.info($scope.list);
		 });

});