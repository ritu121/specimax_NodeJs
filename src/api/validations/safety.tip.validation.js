const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listTips: {
    query: {
      name: Joi.string().min(3),
    },
  },

  // POST /v1/Statuss
  createTip: {
    body: {
        title: Joi.string().min(3),
        description: Joi.string().min(3),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceTip: {
    body: {
        title: Joi.string().min(3),
        description: Joi.string().min(3),
    },
    params: {
      TipId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateTip: {
    body: {
        title: Joi.string().min(3),
        description: Joi.string().min(3),
    },
    params: {
      tipId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
