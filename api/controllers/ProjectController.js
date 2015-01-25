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
        //console.log('display only');

        Project.find()
        .populate('relations')
        .exec(function (err, projects){
            if(err) return next(err);
            res.view({
                flock : projects
            });
        });
    } else {
        //console.log("not log in");
        var referal = encodeURIComponent(req.originalUrl);
        res.redirect('/login?referal=' + referal);
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
    //console.log("trace: project.create");
    if (req.isAuthenticated()) {
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
    } else {
        var referal = encodeURIComponent(req.originalUrl);
        res.redirect('/login?referal=' + referal);
    }
    
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
    },
    link: function(req, res, next){
        var userAgent = req.get('User-Agent');
        console.log("userAgent: %j", userAgent);

        Project.findOne(req.param('id'),function(err, project){
            if(err) return next(err);

            var agent = ProjectController.parse(userAgent);
            console.log("agent: %j ", agent);

            if(agent.browser.wechat == true) {
                console.log("go to wechat");
                res.redirect(project.wechat_link);
                // return true;
            }else if (agent.platform.iphone == true || agent.platform.ipad == true) {
                console.log("go to ios");
                res.redirect(project.ios_link);
            }else if (agent.platform.android == true){
            //else if (/Android/.test(userAgent)){
                console.log("go to android");
                res.redirect("http://" + project.android_link);
            }else{
                console.log("go to default");
                //res.redirect("http://"+project.default_link);
                res.view({
                    project : project
                });
            }
        });

        

        // Project.find({ _id : req.params.project }, function(err, project) { 
        // res.view({
        // project : project // get the user out of session and pass to template
        // });
    },


    parse: function (uaStr) {
        var agent = {
            platform: {},
            browser: {},
            engine: {}
        };
        var ua = uaStr,
        p = agent.platform,
        b = agent.browser,
        e = agent.engine;



        // detect platform
        if (/Windows/.test(ua)) {
            p.name = 'win';
            p.win = true;
        } else if (/iPhone|iPod/.test(ua)) {
            p.name = 'iphone';
            p.iphone = true;
        } else if (/iPad/.test(ua)) {
            p.name = 'ipad';
            p.ipad = true;
        } else if (/Mac/.test(ua)) {
            p.name = 'mac';
            p.mac = true;
        } else if (/Linux/.test(ua)) {
            p.name = 'linux';
            p.linux = true;
        } else if (/Android/.test(ua)) {
            p.name = 'android';
            p.android = true;
        } else {
            p.name = 'other';
            p.unknown = true;
        }

        // detect browser
        if (/MSIE/.test(ua)) {
            b.name = 'msie';
            b.msie = true;
        } else if (/Firefox/.test(ua)) {
            b.name = 'firefox';
            b.firefox = true;
        } else if (/Chrome/.test(ua)) { // must be tested before Safari
            b.name = 'chrome';
            b.chrome = true;
        } else if (/Safari/.test(ua)) {
            b.name = 'safari';
            b.safari = true;
        } else if (/Opera/.test(ua)) {
            b.name = 'opera';
            b.opera = true;
        } else if (/MicroMessenger/.test(ua)) {
            b.name = 'wechat';
            b.wechat = true;
        } else {
            b.name = 'other';
            b.unknown = true;
        }


        // detect browser version
        if (b.msie) {
            b.version = /MSIE (\d+(\.\d+)*)/.exec(ua)[1];
        } else if (b.firefox) {
            b.version = /Firefox\/(\d+(\.\d+)*)/.exec(ua)[1];
        } else if (b.chrome) {
            b.version = /Chrome\/(\d+(\.\d+)*)/.exec(ua)[1];
        } else if (b.safari) {
            b.version = /Version\/(\d+(\.\d+)*)/.exec(ua)[1];
        } else if (b.opera) {
            b.version = /Version\/(\d+(\.\d+)*)/.exec(ua)[1];
        } else {
            b.version = 0;
        }

        // detect engine
        if (/Trident/.test(ua) || b.msie) {
            e.name = 'trident';
            e.trident = true;
        } else if (/WebKit/.test(ua)) { // must be tested before Gecko
            e.name = 'webkit';
            e.webkit = true;
        } else if (/Gecko/.test(ua)) {
            e.name = 'gecko';
            e.gecko = true;
        } else if (/Presto/.test(ua)) {
            e.name = 'presto';
            e.presto = true;
        } else {
            e.name = 'other';
            e.unknown = true;
        }

        // detect engine version
        if (e.trident) {
            e.version = /Trident/.test(ua)? /Trident\/(\d+(\.\d+)*)/.exec(ua)[1]: 0;
        } else if (e.gecko) {
            e.version = /rv:(\d+(\.\d+)*)/.exec(ua)[1];
        } else if (e.webkit) {
            e.version = /WebKit\/(\d+(\.\d+)*)/.exec(ua)[1];
        } else if (e.presto) {
            e.version = /Presto\/(\d+(\.\d+)*)/.exec(ua)[1];
        } else {
            e.version = 0;
        }

        return agent;
    }

};

module.exports = ProjectController;
