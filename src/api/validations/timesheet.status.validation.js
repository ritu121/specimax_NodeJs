const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listStatuses: {
    query: {
      name: Joi.string().min(3),
    },
  },

  // POST /v1/Statuss
  createStatus: {
    body: {
        name: Joi.string().min(3),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceStatus: {
    body: {
        name: Joi.string().min(3),
    },
    params: {
      statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateStatus: {
    body: {
        name: Joi.string().min(3),
    },
    params: {
      statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
