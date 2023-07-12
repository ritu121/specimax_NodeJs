const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listReportTypes: {
    query: {
      name: Joi.string().min(3),
    },
  },

  // POST /v1/Statuss
  createReportType: {
    body: {
        name: Joi.string().min(3),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceReportType: {
    body: {
        name: Joi.string().min(3),
    },
    params: {
      typeId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateReportType: {
    body: {
        name: Joi.string().min(3),
    },
    params: {
      typeId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
