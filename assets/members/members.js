'use strict';

angular.module('myApp.members', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/members/:projectId', {
      controller:'MemController',
      templateUrl:'/members/members.html'
   }).when('/right', {
      controller:'RightController',
      templateUrl:'/members/right.html'
   });
}])
.controller('MemController', function($scope, $location, $routeParams, $http){
	var projectId = $routeParams.projectId;
	console.log("peoject id is" + projectId);
	 $scope.mem = [];
	 $http.get("http://localhost:1337/api/projects/"+projectId+"/members")
		 .success(function(data){
		 	$scope.mem=data;
		 	console.log($scope.mem);
		 });
		 
});