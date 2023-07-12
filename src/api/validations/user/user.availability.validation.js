const Joi = require('joi');

module.exports = {

  // GET /v1/user/status
  getAvailability: {

  },

  // POST /v1/Statuss
  updateAvailability: {
    params: {
      availabilityId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
    body: {
      startTime: Joi.string().required(),
      endTime: Joi.string().required(),
    },
  },

};
