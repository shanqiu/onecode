var employeeApp = angular.module('employeeApp', []); // Defines an angular module

employeeApp.controller('EmployeeController',function($scope,$http,$log){
  //$log is used for console log
  //$http is used to communicate with the server 
  //$scope defines the scope of controller
  $scope.employees=[];
  $http.get("http://localhost:1337/api/projects")
     .success(function(data){
      $scope.employees=data;
      $log.info($scope.employees);
     });
});