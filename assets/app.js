

// Declare app level module which depends on views, and components
angular.module('myApp', [
  // 'ngRoute',
  // 'myApp.list',
  // 'myApp.edit',
  // 'myApp.me',
  // 'myApp.members',
  'myApp.projects',
  'myApp.projects.service',
  'myApp.utils.service',
  'ui.router', 
  'myApp.version'
])
.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts1.list') }"> will set the <li>
    // to active whenever 'contacts1.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    }
  ]
)

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider

        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
        .when('/c?id', '/projects/:id')
        .when('/user/:id', '/projects/:id')

        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/');


      //////////////////////////
      // State Configurations //
      //////////////////////////

      // Use $stateProvider to configure your states.
      $stateProvider

        //////////
        // Home //
        //////////
        .state("home", {

          url: "/",
          templateUrl: 'projects/home.html'

        })
        .state("about", {

          // Use a url of "/" to set a states as the "index".
          url: "/about",
          views: {

            '': {
              templateUrl: 'projects/about.html',
              controller: ['$scope', '$state', '$location', '$http',
                function (  $scope,  $state,  $location, $http) {
                  $http.get("http://localhost:1337/api/users/me")
                     .success(function(data){
                      $scope.me=data;
                      console.log($scope.me);
                    });
              }]
            }
          }
        })
    }
  ]
);

// myApp.config(['$routeProvider', function($routeProvider) {
//   $routeProvider.otherwise({redirectTo: '/view1'});
// }]);


// myApp
// .config(function($routeProvider) {
//   $routeProvider
//   	// .when('/list', {
//   	//   controller:'ListController',
//   	//   templateUrl:'/list/list.html'
//   	// })
//     // .when('/edit/:projectId', {
//     //   controller:'EditController',
//     //   templateUrl:'/view2/view2.html'
//     // })
//     .otherwise({
//       redirectTo:'/'
//     });
// });


// // .controller('EditController', function($scope, $location, $routeParams, $http){
// // 	var projectId = $routeParams.projectId;
// // 	console.log("peoject id is" + projectId);
// // 	$scope.item = new Object();
// // 	$http.get("http://localhost:1337/api/projects/"+projectId)
// // 		 .success(function(data){
// // 		 	$scope.item=data;
// // 		 	console.log($scope.item);
// // 		 });

// // 	$scope.submitForm = function(li){
// // 		console.log("li is" + li);
// // 	}
// // });
