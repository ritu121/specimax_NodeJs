const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listLogs: {
    query: {
    },
  },

  // POST /v1/Statuss
  createLogs: {
    body: {
    log: Joi.string().min(3).required(),
    //   keyword: Joi.string().min(3).required(),
      // document: Joi.any().required(),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceLogs: {
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
  updateLogs: {
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
