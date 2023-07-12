const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listRoles: {
    query: {
      name: Joi.string().min(3),
    },
  },

  // POST /v1/Statuss
  createRole: {
    body: {
        name: Joi.string().min(3),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceRole: {
    body: {
        name: Joi.string().min(3),
    },
    params: {
      roleId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateRole: {
    body: {
        name: Joi.string().min(3),
    },
    params: {
      roleId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
