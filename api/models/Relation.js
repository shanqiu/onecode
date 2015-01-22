var Relation = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
	user: { model: 'User', required: true },
	project: { model: 'Project', required: true },	
	access  : { type: 'string'} // admin, editor, readonly, none

  }
};

module.exports = Relation;