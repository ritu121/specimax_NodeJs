const Joi = require('joi');

module.exports = {

  // GET /v1/user/status
  listShifts: {
  },

  deleteShift: {

  },

  viewShift: {

  },

  // POST /v1/Statuss
  updateShift: {
    body: {
      inOut: Joi.string().valid('IN','OUT',null).allow(null),
      shiftDate: Joi.date().required(),
      latitude : Joi.string().min(3).required(),
      longitude: Joi.string().min(3).required(),
    },
  },

  replaceShift: {
    body: {
      inOut: Joi.string().valid('IN','OUT',null).allow(null),
      shiftDate: Joi.date().required(),
      latitude : Joi.string().min(3).required(),
      longitude: Joi.string().min(3).required(),
    },
  },

  createShift: {
    body: {
      inOut: Joi.string().valid('IN','OUT',null).allow(null),
      shiftDate: Joi.date().required(),
      latitude : Joi.string().min(3).required(),
      longitude: Joi.string().min(3).required(),
    },
  },

};
