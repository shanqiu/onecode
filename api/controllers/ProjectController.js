/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var ProjectController = {

  display: function (req, res) {
    if (req.isAuthenticated()) {
        console.log('Test only');

        Project.find(function foundProjects(err, projects){
            if(err) return next(err);
            res.view({
                flock : projects
            });
        }).populate("users").exec(function (e, r) {
        console.log(r.toJSON());
        });
    } else {
        console.log("not log in");
    }
        
    
	// Project.findAll().exec(function(err, doc) {
	//  	if(err){
	//  		console.log("err");
	//  	}else{
	// 	    res.view({
	// 	    	req : req, 
	// 	    	res : res,
	// 	    	flock: doc
	// 	    });
	// 	}	
	//  });

  },

  'new': function(req, res){
    res.view();
  },

  create: function(req, res){
    // var us = new Array();
    // us[0] = req.user;
    // console.log('Test only: create'+req.user.username);

    Project.create({
    	wechat_link : req.body.wechat_link, 
        ios_link : req.body.ios_link,
        default_link : req.body.default_link,
        android_link : req.body.android_link,
        project_name : req.body.project_name
    }).exec(function(err, project){
    	if(err){
    		console.log("err");
    	}else{
            Project.findOne({project_name: req.body.project_name}, function (err, game){
                User.create({
                  username: 'map1'
                }).exec(console.log);
              });
            // project.users.push(req.user);
            // project.save(function(err){});
            // req.user.projects.add(project.id);
            // req.user.save();
            res.redirect('/project/display');
    	}
    }); 
    
  },
    edit : function (req, res, next){

        Project.findOne(req.param('id'), function foundProject(err,project){
            if(err) return next(err);
            if(!project) return next();

            res.view({
                project : project
            });
        });

    },
    //unfinished
    update: function(req, res, next){
        Project.update(req.param('id'), req.params.all(), function projectUpdated(err){
            if(err){
                return res.redirect('/project/edit/' + req.param('id'));
            }

            res.redirect('/project/display');
        });
    },

    delete: function(req, res, next){
        Project.findOne(req.param('id'), function foundProject(err,user){
            if(err) return next(err);
            if(!user) return next('User doen\'t exist/');

            Project.destroy(req.param('id'), function projectDestroyed(err){
                if(err) return next(err);
            });

            res.redirect('/project/display');
        });
    }

};

module.exports = ProjectController;
