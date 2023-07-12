const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listCounties: {
    query: {
      name: Joi.string().min(3),
    },
  },

};
