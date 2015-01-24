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
        console.log('display only');

        Project.find()
        .populate('users')
        .exec(function (err, projects){
            if(err) return next(err);
            res.view({
                flock : projects
            });
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

    console.log("trace: project.create");
    User.findOne(req.user.id).exec(function(err, user) {
        if(err)  {
            // handle error
            console.log("err on user.findone: %j", err);
        } else {
            user.projects.add({
                wechat_link : req.body.wechat_link, 
                ios_link : req.body.ios_link,
                default_link : req.body.default_link,
                android_link : req.body.android_link,
                project_name : req.body.project_name,
            });
            user.save(function(err) {
                if(err) {
                    console.log("err on user.save: %j", err);
                } else {
                    console.log('saved user %j', user);
                    User.findOne(req.user.id)
                    .populate('projects')
                    .exec(function (err, user){
                        if(err) {
                            console.log("err on user.save: %j", err);
                        }else {
                            console.log('saved user %j', user);
                            res.redirect('/project/display');
                        } 
                    });
                }
            });
        }
    });


    
    // Project.create({
    //     wechat_link : req.body.wechat_link, 
    //     ios_link : req.body.ios_link,
    //     default_link : req.body.default_link,
    //     android_link : req.body.android_link,
    //     project_name : req.body.project_name,
    // }).exec(function(err, project){
    //     if(err){
    //        console.log("err on Project.create: %j", err);
    //     }else{
    //         console.log("saved %j", project);
    //         console.log("user to add: %j", req.user);
    //         console.log("project.users %j", project.users);

    //         req.user.projects.add(project.id);
    //         req.user.save(function(err) {
    //             if(err) {
    //                 console.log("err on user.save: %j", err);
    //             } else {
    //                 console.log('saved user %j', req.user);
    //                 res.redirect('/project/display');
    //             }
    //         });

    //         // project.users.add(req.user.id);
    //         // console.log("project.users added %j", project.users);
    //         // project.save(function(err) {
    //         //     if(err) {
    //         //         console.log("err on project.save: %j", err);
    //         //     } else {
    //         //         console.log("saved project %j", project);
    //         //         // console.log("saved user %j", User);
    //         //         // res.redirect('/project/display');
    //         //         req.user.projects.add(project.id);
    //         //         req.user.save(function(err) {
    //         //             if(err) {
    //         //                 console.log("err on user.save: %j", err);
    //         //             } else {
    //         //                 console.log('saved user %j' + req.user);
    //         //                 res.redirect('/project/display');
    //         //             }
    //         //         });
    //         //     }
    //         // });
    //     }
    // });
    

    // Project.create({
    // 	wechat_link : req.body.wechat_link, 
    //     ios_link : req.body.ios_link,
    //     default_link : req.body.default_link,
    //     android_link : req.body.android_link,
    //     project_name : req.body.project_name
    // }).exec(function(err, project){
    // 	if(err){
    // 		console.log("err");
    // 	}else{
    //         Project.findOne({project_name: req.body.project_name}, function (err){
    //             User.create({
    //               username: req.user.username
    //             }).exec(console.log);
    //           });
    //         console.log("user is "+ req.user);
    //         // project.users.push(req.user);
    //         // project.save(function(err){});
    //         // req.user.projects.add(project.id);
    //         // req.user.save();
    //         res.redirect('/project/display');
    // 	}
    // }); 
    
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
