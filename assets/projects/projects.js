angular.module('myApp.projects', [
  'ui.router'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        //////////////
        // projects //
        //////////////
        .state('projects', {
          abstract: true,
          url: '/projects',
          templateUrl: 'projects/projects.html',

          resolve: {
            projects: ['projects',
              function( projects){
                return projects.all();
              }]
          },

          controller: ['$scope', '$state', 'projects', 'utils',
            function (  $scope,   $state,   projects,   utils) {
              $scope.projects = projects;
            }]
        })

        /////////////////////
        // projects > List //
        /////////////////////

        .state('projects.list', {

          url: '',
          templateUrl: 'projects/projects.list.html'
        })

        ///////////////////////
        // projects > Detail //
        ///////////////////////

        .state('projects.detail', {

          url: '/{projectId:[0-9]{1,4}}',
          views: {

            '': {
              templateUrl: 'projects/projects.detail.html',
              controller: ['$scope', '$stateParams', '$state', 'utils',
                function (  $scope,   $stateParams,  $state,  utils) {
                  //⬇️
                  $scope.project = utils.findById($scope.projects, $stateParams.projectId);
                  $scope.edit = function () {
                    $state.go('.edit', $stateParams);
                  };
                }]
            }
          },
          'hint@': {
              template: 'This is projects.detail populating the "hint" ui-view'
          },
        })
                ///////////////////////
        // projects > Detail > Edit //
        ///////////////////////

        .state('projects.detail.edit', {

          views: {
            '@projects': {
              templateUrl: 'projects/projects.detail.edit.html',
              controller: ['$scope', '$stateParams', '$state', 'utils',
                function (  $scope,   $stateParams,   $state,   utils) {
                  $scope.project = utils.findById($scope.projects, $stateParams.projectId);
                  $scope.done = function () {
                    // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.
                    $state.go('^', $stateParams);
                  };
                }]
              }
            }

        })
        //////////////////////////////
        // Projects > Detail > Member //
        //////////////////////////////
        .state('projects.detail.member', {

          url: '/member/:memberId',
          views: {

            '': {
              templateUrl: 'projects/projects.detail.member.html',
              controller: ['$scope', '$stateParams', '$state', 'utils',
                function (  $scope,   $stateParams,   $state,   utils) {
                  //scope的名字是和上一级的controller相同 所以是scope.project ⬆️
                  $scope.member = utils.findById($scope.project.project.members, $stateParams.memberId);

                  $scope.edit = function () {
                    // Here we show off go's ability to navigate to a relative state. Using '^' to go upwards
                    // and '.' to go down, you can navigate to any relative state (ancestor or descendant).
                    // Here we are going down to the child state 'edit' (full name of 'contacts1.detail.item.edit')
                    $state.go('.edit', $stateParams);
                  };
                }]
            },

            'hint@': {
              template: ' This is projects.detail.member overriding the "hint" ui-view'
            }
          }
        })
        
        /////////////////////////////////////
        // Projects > Detail > Member > Edit //
        /////////////////////////////////////

        .state('projects.detail.member.edit', {
          views: {

            // This is targeting the unnamed view within the 'contacts1.detail' state
            // essentially swapping out the template that 'contacts1.detail.item' had
            // inserted with this state's template.
            '@projects.detail': {
              templateUrl: 'projects/projects.detail.member.edit.html',
              controller: ['$scope', '$stateParams', '$state', 'utils',
                function (  $scope,   $stateParams,   $state,   utils) {
                  $scope.member = utils.findById($scope.project.project.members, $stateParams.memberId);
                  $scope.done = function () {
                    // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.
                    $state.go('^', $stateParams);
                  };
                }]
            }
          }
        });
    }
  ]
);
