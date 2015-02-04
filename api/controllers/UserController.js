/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var url = require("url");

var UserController = {

  findAll: function(req, res) {
      User.find()
        .populate('relations')
        .exec(function (err, users){
            if(err) return res.negotiate(err);
            return res.json(users);
        });
  },
  findOne: function(req, res) {

      // if (!req.isAuthenticated()) {
      //   return res.forbidden();
      // }

    Relation.find()
    .where({user: req.param('id')})
    .populate('project')
    .exec(function (err, relations){
      if(err) return res.negotiate(err);

      var rels = new Array();
      

      for (var i = 0; i < relations.length; i++) {
        var rel = relations[i];
        if (rel.access != 'none' && rel.project) {
          delete rel['user'];
          delete rel.project['relations'];       
          rels.push(rel);

          // project:{
          //   wechat:
          //   id
          //   relations:shanle
          // }
          // admin:
          // date
          //req.param('id') => rel.project.id

        }
      }

      Relation.find()
          .populate('user')
          .exec(function (err, relas) {
            if (err) return res.negotiate(err);

            //var members = new Array();
              for (var i = 0; i < rels.length; i++) {

                var tempMember = new Array();

                for (var j = 0; j < relas.length; j++) {

                  var rel = relas[j];

                  if (rel.user && rel.access != "none") {
                  if (rel.project == rels[i].project.id) { 
             
                    delete rel['project'];
                    delete rel.user['relations'];
                    delete rel.user['passports'];                      
                    tempMember.push(rel);                   
                  }
                  
                rels[i].project['members'] = tempMember;
              }

             
                    //console.log('rel: %j', rel);
                }
            }

            User.findOne(req.param('id'))
            .exec(function (err, user){
              if(err) return res.negotiate(err);

              if(user.id == req.user.id) {
                // self
                user['workspace'] = rels;  

                res.json(user);
              } else {
                // others

                return res.forbidden();
                user['workspace'] = rels;  
                res.json(user);
              }
              
            });
      });
      
    });
  },
  display: function(req, res){
    // res.view({user:req.user, aaa:"bbb"});
    res.view();
  }

};

module.exports = UserController;
