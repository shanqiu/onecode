'use strict';

angular.module('myApp.edit', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/edit/:projectId', {
      controller:'EditController',
      templateUrl:'/edit/edit.html'
   });
}])
.controller('EditController', function($scope, $location, $routeParams, $http){
	var projectId = $routeParams.projectId;
	console.log("peoject id is" + projectId);
	$scope.item = new Object();
	$http.get("http://localhost:1337/api/projects/"+projectId)
		 .success(function(data){
		 	$scope.item=data;
		 	console.log($scope.item);
		 });
		 
	$scope.submitForm = function(li){
		console.log("li is" + li);
	}
});