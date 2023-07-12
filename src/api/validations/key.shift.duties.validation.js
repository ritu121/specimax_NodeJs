const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listDuties: {
    query: {
    //   title: Joi.string().min(3),
    },
  },

  // POST /v1/Statuss
  createDuty: {
    body: {
        key: Joi.string().min(3).required(),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceDuty: {
    body: {
      key: Joi.string().min(3).required(),
    },
    params: {
        dutyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateDuty: {
    body: {
      key: Joi.string().min(3).required(),
    },
    params: {
        dutyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
