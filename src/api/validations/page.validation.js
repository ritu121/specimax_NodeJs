const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listPages: {
    query: {
    //   title: Joi.string().min(3),
    },
  },

  // POST /v1/Statuss
  createPage: {
    body: {
        title: Joi.string().min(3).required(),
        identifier : Joi.string().min(3).required(),
        description : Joi.string().min(10).required(),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replacePage: {
    body: {
      title: Joi.string().min(3).required(),
      identifier : Joi.string().min(3).required(),
      description : Joi.string().min(10).required(),
    },
    params: {
        pageId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updatePage: {
    body: {
      title: Joi.string().min(3).required(),
      identifier : Joi.string().min(3).required(),
      description : Joi.string().min(10).required(),
    },
    params: {
        pageId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
