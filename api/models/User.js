var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' },
    //relations : { collection: 'Relation', via: 'user' },

    projects : { collection: 'Project', via: 'users', dominant: true }
  }
};

module.exports = User;
