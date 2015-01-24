var Project = { 

	schema: true,

	attributes:{
	    wechat_link : { type: 'string', unique: false }, 
	    ios_link : { type: 'string', unique: false }, 
	    android_link : { type: 'string', unique: false },
	    default_link : { type: 'string', unique: false },
	    project_name: { type: 'string', unique: false },
	    //relations : {collection: 'Relation', via: 'project'}
	    users : { collection: 'User', via: 'projects' }
	},
	// beforeCreate: function(values, next) {
	//   next();
	// },
};
// export them 
module.exports = Project;
// exports.Owner = mongoose.model('Owner', _Owner);