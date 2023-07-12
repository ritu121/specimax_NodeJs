const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listHelps: {
    query: {
    //   title: Joi.string().min(3),
    },
  },

  // POST /v1/Statuss
  createHelp: {
    body: {
        title: Joi.string().min(3).required(),
        description : Joi.string().min(10).required(),
        mediaType : Joi.string().valid('IMAGE','VIDEO').allow(null),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceHelp: {
    body: {
      title: Joi.string().min(3).required(),
      description : Joi.string().min(10).required(),
      mediaType : Joi.string().valid('IMAGE','VIDEO').allow(null),
    },
    params: {
        helpId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateHelp: {
    body: {
      title: Joi.string().min(3).required(),
      description : Joi.string().min(10).required(),
      mediaType : Joi.string().valid('IMAGE','VIDEO').allow(null),
    },
    params: {
        helpId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
