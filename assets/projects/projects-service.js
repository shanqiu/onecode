angular.module('myApp.projects.service', [

])

// A RESTful factory for retrieving projects from 'projects.json'
.factory('projects', ['$http', 'utils', function ($http, utils) {

  var projects = $http.get("http://localhost:1337/api/users/me").then(function (resp) {
    return resp.data.workspace;
  });

  var factory = {};
  factory.all = function () {
    return projects;
  };
  factory.get = function (id) {
    return project.then(function(){
      return utils.findById(projects, id);
    })
  };
  return factory;
}]);
