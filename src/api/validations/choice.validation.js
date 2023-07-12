const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listChoices: {
    query: {
      name: Joi.string().min(3),
    },
  },

  // POST /v1/Statuss
  createChoice: {
    body: {
        name: Joi.string().min(1),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceChoice: {
    body: {
        name: Joi.string().min(1),
    },
    params: {
        choiceId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateChoice: {
    body: {
        name: Joi.string().min(1),
    },
    params: {
        choiceId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
