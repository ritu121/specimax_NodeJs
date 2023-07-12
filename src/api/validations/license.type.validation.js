const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listType: {
    query: {
    },
  },

  // POST /v1/Statuss
  createType: {
    body: {
    name: Joi.string().min(3).required(),
    state: Joi.string().allow(""),
    country: Joi.string().allow(""),

    //   keyword: Joi.string().min(3).required(),
      // document: Joi.any().required(),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceType: {
    body: {
      log: Joi.string().min(3).required(),
    //   keyword: Joi.string().min(3).required(),
      // document: Joi.any().required(),
    },
    params: {
      siteId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateType: {
    body: {
      log: Joi.string().min(3).required(),
    //   keyword: Joi.string().min(3).required(),
      // document: Joi.any().required(),
    },
    params: {
      shiftId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
