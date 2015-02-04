/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var ProjectController = {

  findAll: function (req, res) {
    if (req.isAuthenticated()) {
        //console.log('display only');
        Project.find()
        .populate('relations')
        .exec(function (err, projects){
            if(err) return res.negotiate(err);
            return res.json(projects);
        });
    } else {
        return res.forbidden(); 
    }
    
  },


  findOne: function (req, res) {
    if (req.isAuthenticated()) {
        Relation.find()
        .where({project: req.param('id')})
        .populate('user')
        .exec(function (err, relations) {
            if (err) {
                return res.negotiate(err);
            }

            var members = new Array();
            var hasMe = false;
            for (var i = 0; i < relations.length; i++) {
                var rel = relations[i];
                if (rel.user && rel.access != "none") {
                    if (rel.user.id == req.user.id) {                       
                        hasMe = true;
                    }
                    delete rel['project'];
                    delete rel.user['relations'];
                    delete rel.user['passports'];
                    members.push(rel);
                }
            }

            if (!hasMe) {
                res.forbidden();
            }

            // access
            Project.findOne(req.param('id'))
            .exec(function (err, project){
                if (err) {
                    return res.negotiate(err);
                }

                if (!project) {
                    res.notFound();
                }

                project['members'] = members;
                res.json(project);
            });

        });
        //console.log('display only');
        // Project.findOne(req.param('id'))
        // .populate('relations')
        // .exec(function (err,project){
        //     if (err) {
        //       return res.serverError();
        //     }
        //     if (project) {
        //         var hasMe = false;

        //         for (var i = project.relations.length - 1; i >= 0; i--) {

        //             if (project.relations[i].user == req.user.id && ( project.relations[i].access == "admin" || project.relations[i].access == "collarator" )) {                       
        //                 hasMe = true;
        //             }

        //         };

        //         //find related Users
        //         console.log("has me is " + hasMe);
                

        //         User.find().exec(function (err, users){
        //             var userArr = new Array();
        //             console.log("yoo");
        //             for (var i = 0; i < users.length; i++) {
        //                 for (var j = 0; j < project.relations.length; j++) {
        //                     if(users[i].id == project.relations[j].user){
                                
        //                         project.relations.push(users[i]);
        //                     }
        //                 };
        //             };

        //             var finalobj={};
        //             for(var _obj in project) finalobj[_obj ]=project[_obj];
        //             //  for(var _obj in users) finalobj.relations[_obj ]=users[_obj];
        //             console.log("oo %j", finalobj);

        //             if(hasMe){
        //                 return res.json(project);  
        //             } else {
        //                 return res.forbidden();
        //             }
        //         });
                
        //         // project.users = project.relations;
        //         // delete project['relations'];

            
        //     } else {
        //       return res.notFound(); //404
        //     }
        // });

    } else {
        return res.forbidden();
    }
    
  },

  findMemberGroup: function (req, res) {
    if (req.isAuthenticated()) {
        Relation.find()
        .where({project: req.param('id')})
        .populate('user')
        .exec(function (err, relations){
            if (err) {
                  return res.serverError();
            }

            var array = new Array();
            var hasMe = false;
            for (var i = 0; i < relations.length; i++) {
                // isMe
                console.log("relations[i].user %j", relations[i]);
                if(relations[i].user){
                    if (relations[i].user.id == req.user.id && ( relations[i].access == "admin" || relations[i].access == "collarator" )) {
                        hasMe = true;
                        console.log("00000000000");
                    }
                    if (relations[i].user) {
                        array.push(relations[i].user);
                    }
                }
            };

            if(hasMe){
                return res.json(array);
            } else {
                return res.forbidden();
            }
            
        });

        // Project.findOne(req.param('id'))
        //     .populate('relations')
        //     .exec(function (err,project){
        //         if (err) {
        //           return res.serverError();
        //         }
        //         if (project) {
        //             for (var i = project.relations.length - 1; i >= 0; i--) {
        //                 if (project.relations[i].user == req.user.id && ( project.relations[i].access == "admin" || project.relations[i].access == "collarator" )) {
        //                     return res.json(project.relations);  
        //                 }
        //             };
        //             return res.forbidden();  
        //         } else {
        //           return res.notFound(); //404
        //         }
        // });
    } else {
        return res.forbidden();
    }
  },

  findMember: function (req, res) {
    if (req.isAuthenticated()) {
        Project.findOne(req.param('id'))
            .populate('relations')
            .exec(function (err,project){
                if (err) {
                  return res.serverError();
                }
                if (project) {

                    var arr = new Array();
                    var hasMe = false;
                    var hasHim = false;
                    for (var i = project.relations.length - 1; i >= 0; i--) {

                        if (project.relations[i].user == req.user.id && ( project.relations[i].access == "admin" || project.relations[i].access == "collarator" )) {
                            hasMe = true;
                            if (req.param('uid') == req.user.id) {
                                return res.json(req.user);
                            }
                        }
                        if (project.relations[i].user == req.param('uid')) {
                            hasHim = true;
                            // arr.push(project.relations[i]);
                        }
                    };
                    if (hasMe) {
                        if (hasHim) {
                            User.findOne(req.param('uid'))
                            .exec(function (err, user){
                                if (err) return res.negotiate(err);
                                return res.json(user);
                            });
                        } else {
                            return res.notFound();
                        }
                    } else {
                        return res.forbidden();
                    }
                    // return res.json(arr);

                } else {
                  return res.notFound(); //404
                }
        });
    } else {
        return res.forbidden();
    }
  },

  display: function (req, res) {
    if (req.isAuthenticated()) {

        Relation.find()
        // .where({access: ['admin', 'xxx', 'xxx']})
        .populate('user', {email: req.user.email})
        .populate('project')
        .exec(function (err, relations){
            if(err) return res.negotiate(err);
            
            var arr = new Array();
            for (var i = relations.length - 1; i >= 0; i--) {
                // judge permission
                // user能看所有参与的项目的信息
               // if(relations[i].access == 'admin' || relations[i].access == 'collarator'){
                    if (relations[i].user && relations[i].user.id == req.user.id) {
                        if (relations[i].project) {
                            arr.push(relations[i]);
                        };
                    }
               // }
            };
            console.log(arr);
            res.view({
                flock : arr
            });

        });
    } else {
        //console.log("not log in");
        var referal = encodeURIComponent(req.originalUrl);
        res.redirect('/login?referal=' + referal);
    }

  },

  'new': function(req, res){
    //console.log('trace project.new');
    if (req.isAuthenticated()) {
        res.view();
    }else{
        // console.log('req referer: %j in project/new', req.headers['referer']);
        // req.flash('originalUrl', req.originalUrl);
        var referal = encodeURIComponent(req.originalUrl);
        res.redirect('/login?referal=' + referal);
    }
  },

  formGroup: function(req, res){
    if (req.isAuthenticated()) {
        res.view();
    } else {
        return res.forbidden();
    }
  },

  formMemberGroup: function(req, res){
    if (req.isAuthenticated()) {
        res.view();
    } else {
        return res.forbidden();
    }
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

  addOne : function(req, res) {
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
                        res.json(project);
                    }
                });
            }
        });
    } else {
        return res.forbidden();
    }
  },

  addMember: function(req, res){
    if (req.isAuthenticated()) {

        // judge if the current user is the admin of the project
        Relation.find()
        .where({project: req.param('id')})
        .exec(function (err, relations){
            if (err) {
                  return res.serverError();
            }

            var hasMe = false;
            for (var i = 0; i < relations.length; i++) {
                // isMe
                if (relations[i].user){
                    if (relations[i].user == req.user.id && relations[i].access == "admin" ) {
                        hasMe = true;
                    }
                }
            };

            if(hasMe){
                Relation.create({
                    user: req.body.user,
                    project: req.param('id'),
                    access: req.body.access

                }).exec(function (err, relation){
                    if(err){
                        return res.negotiate(err);
                    }else{
                        res.json(relation);
                    }
                });
            } else {
                return res.forbidden();
            }
            
        });  
    } else {
        return res.forbidden();
    } 
  },

  edit : function (req, res, next){
    if (req.isAuthenticated()) {
        Project.findOne(req.param('id'), function foundProject(err,project){
            if(err) return next(err);
            if(!project) return next();

            res.view({
                project : project
            });
        });
    } else {
       return res.forbidden(); 
    }

  },

  formOne: function(req, res, next){
    if (req.isAuthenticated()) {
        Project.findOne(req.param('id'), function foundProject(err,project){
            if(err) return next(err);
            if(!project) return next();

            res.view({
                project : project
            });
        });
    } else {
       return res.forbidden();  
    }
  },

  formMember: function(req, res, next){
    if (req.isAuthenticated()) {
        Project.findOne(req.param('id'))
            .populate('relations')
            .exec(function (err, project){
                if (err) {
                    return res.negotiate(err);
                } else {
                    console.log("member project is %j ", project);
                    var arr = new Array();
                    for (var i = project.relations.length - 1; i >= 0; i--) {
                        if (project.relations[i].user == req.param('uid')) {
                            arr.push(project.relations[i]);
                        }
                    };
                    console.log("arr project is %j ", arr);
                    res.view({
                        relations : arr[0]
                    });
                    
                }
        });
    } else {
        return res.forbidden();
    }
  },


  update: function(req, res, next){
    if (req.isAuthenticated()) {


            Project.update(req.param('id'), req.params.all(), function projectUpdated(err){
            if(err){
                return res.redirect('/project/edit/' + req.param('id'));
            }

            res.redirect('/project/display');
        });

    } else {
        return res.forbidden();
    }
  },

  updateOne: function(req, res, next){
    if (req.isAuthenticated()) {
        Project.findOne(req.param('id'))
            .populate('relations')
            .exec(function (err, project){
                if (err) {
                    return res.negotiate(err);
                } else {
                    for (var i = project.relations.length - 1; i >= 0; i--) {
                        //judge if the user is the admin or collabrator of the project
                        if (project.relations[i].user == req.param('uid')) {
                            Project.update(req.param('id'), req.params.all(), function projectUpdated(err){
                                if(err) return err.negotiate();
                            });
                            return res.json(project);
                        }
                    };
                }
            });
        } else {
            return res.forbidden(); 
        }
  },

  updateMember: function (req, res, next){


    if (req.isAuthenticated()) {

        // judge if the current user is the admin of the project
    Relation.find()
        .where({project: req.param('id')})
        .exec(function (err, relations){
            if (err) return res.serverError();

            var hasMe = false;
            var hasHim = false; 
            var relId;
            for (var i = 0; i < relations.length; i++) {
                // isMe
                if (relations[i].user == req.user.id && relations[i].access == "admin" ) {
                    hasMe = true;
                }

                if (relations[i].user == req.param("uid") ) {
                    hasHim = true;
                    relId = i;
                }

            };

            if(hasMe){
                if(hasHim){
                        relations[relId].access = req.body.access; 
                        relations[relId].save(function(err) {
                            return res.negotiate(err);
                        });
                        return res.json(relations[relId]);
               }else{
                res.notFound();
               }
            } else {
                return res.forbidden();
            }
            
        });  
    } else {
        return res.forbidden();
    } 


        // Relation.update({user}, req.params.all(), function projectUpdated(err){
        //     if(err){
                
        //     }

        //     res.redirect('/api/projects/'+req.param('id'));
        // });
  },

  delete: function(req, res, next){
    if (req.isAuthenticated()) {
        Project.findOne(req.param('id'), function foundProject(err,user){
            if(err) return next(err);
            if(!user) return next('User doen\'t exist/');

            Project.destroy(req.param('id'), function projectDestroyed(err){
                if(err) return next(err);
            });
            res.redirect('/project/display');
        });
    } else {
        return res.forbidden(); 
    }
  },

  delOne: function(req, res, next){
    if (req.isAuthenticated()) {
        Relation.find()
            .where({project: req.param('id')})
            .exec(function (err, relations){
                if (err) {
                    return res.serverError();
                } else {
                    var hasMe = false;

                    for (var i = 0; i < relations.length; i++) {
                    // isMe
                        if (relations[i].user == req.user.id && relations[i].access == "admin" ) {
                            hasMe = true;
                        }
                    }

                    if(hasMe){
                        Project.findOne(req.param('id'), function foundProject(err,project){
                            if(err) return next(err);
                            if(!project) return next('Project doen\'t exist/');

                            Project.destroy(req.param('id'), function projectDestroyed(err){
                                if(err) return next(err);
                            });
                            res.ok();
                        });
                    }
                }
            });      
    } else {
        return res.forbidden(); 
    }
  },

  delMember: function(req, res){
    if (req.isAuthenticated()) {
        Project.findOne(req.param('id'))
        .populate('relations')
        .exec(function (err, project){
            if (err) {
                return res.negotiate(err);
            } else {

                var hasMe = false;
                var hasHim = false;
                var relation;

                for (var i = project.relations.length - 1; i >= 0; i--) {
                    if (project.relations[i].user == req.user.id && project.relations[i].access == "admin" ) {
                        hasMe = true;
                    }
                    if (project.relations[i].user == req.param('uid')) {
                        hasHim = true;
                        relation = project.relations[i];                  
                    }
                                          
                };

                if(hasMe) {
                    if(hasHim){
                        relation.access = "none";
                        project.save(function (err){
                        });
                        return res.ok(); 

                    } else {
                        res.notFound();
                    }
                } else {
                    return res.forbidden();
                }
            }
        });
    } else {
        return res.forbidden();
    }
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
