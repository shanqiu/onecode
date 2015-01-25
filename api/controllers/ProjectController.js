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
        .populate('relations')
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
    console.log('trace project.new');
    if (req.isAuthenticated()) {
        res.view();
    }else{
        // console.log('req referer: %j in project/new', req.headers['referer']);
        // req.flash('originalUrl', req.originalUrl);
        var referal = encodeURIComponent(req.originalUrl);
        res.redirect('/login?referal=' + referal);
    }
  },

  addMember: function(req, res){

  },

  create: function(req, res){
    console.log("trace: project.create");
        
    Project.create({
        wechat_link : req.body.wechat_link, 
        ios_link : req.body.ios_link,
        default_link : req.body.default_link,
        android_link : req.body.android_link,
        project_name : req.body.project_name,
    }).exec(function(err, project){
        if(err){
           console.log("err on Project.create: %j", err);
        }else{
            Relation.create({
                user: req.user.id,
                project: project.id,
                access: 'admin'
            }).exec(function(err, relation) {
                if(err){
                    console.log("err on Relation.create: %j", err);
                }else{
                    res.redirect('/project/display');
                }
            });
        
        }
    });
        // User.findOne(req.user.id).exec(function(err, user) {
    //     if(err)  {
    //         // handle error
    //         console.log("err on user.findone: %j", err);
    //     } else {
    //         user.projects.add({
    //             wechat_link : req.body.wechat_link, 
    //             ios_link : req.body.ios_link,
    //             default_link : req.body.default_link,
    //             android_link : req.body.android_link,
    //             project_name : req.body.project_name,
    //         });
    //         user.save(function(err) {
    //             if(err) {
    //                 console.log("err on user.save: %j", err);
    //             } else {
    //                 console.log('saved user %j', user);
    //                 User.findOne(req.user.id)
    //                 .populate('projects')
    //                 .exec(function (err, user){
    //                     if(err) {
    //                         console.log("err on user.save: %j", err);
    //                     }else {
    //                         console.log('saved user %j', user);
                            
    //                     } 
    //                 });
    //                 res.redirect('/project/display');
    //             }
    //         });
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
