const Joi = require('joi');

module.exports = {

  // GET /v1/user/status
  getGpsSetting: {

  },

  // POST /v1/Statuss
  updateGpsSetting: {
    body: {
      gpsTrackingDuringShift: Joi.boolean().required(),
      gpsTrackingHistory : Joi.boolean().required(),
    },
  },

};
