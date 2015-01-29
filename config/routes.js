/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': {
  //   view: 'homepage'
  // },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  'get /':'AuthController.display',
  'get /api/users/:id':'AuthController.findOne',
  'get /api/users':'AuthController.findAll',
  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  // 'get /user/register': 'AuthController.register',
  'get /user/register': 'AuthController.register',

  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',

  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback',

  'get /api/projects':'ProjectController.findAll',
  'get /api/projects/:id':'ProjectController.findOne',
  'get /form/projects':'ProjectController.formGroup',
  'post /api/projects':'ProjectController.addOne',
  'get /form/projects/:id':'ProjectController.formOne',
  'post /api/projects/:id':'ProjectController.updateOne',

  'delete /api/projects/:id':'ProjectController.delOne',
  
  'get /api/projects/:id/members':'ProjectController.findMemberGroup',
  'get /form/projects/:id/members':'ProjectController.formMemberGroup',
  'post /api/projects/:id/members':'ProjectController.addMember',
  'get /api/projects/:id/members/:uid':'ProjectController.findMember',
  'get /form/projects/:id/members/:uid':'ProjectController.formMember',
  'delete /api/projects/:id/members/:uid':'ProjectController.delMember',
  'post /api/projects/:id/members/:uid':'ProjectController.updateMember',



  '/project/create' :{
    controller : 'ProjectController',
    action : 'create'
  },
  '/project/new' :{
    controller : 'ProjectController',
    action : 'new'
  },
  '/project/display' :{
    controller : 'ProjectController',
    action : 'display'
  },
  '/project/edit/:id' :{
    controller : 'ProjectController',
    action : 'edit'
  },
  '/project/link/:id' :{
    controller : 'ProjectController',
    action : 'link'
  },
};
