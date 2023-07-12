const Joi = require('joi');

module.exports = {

  // GET /v1/user/status
  getSetting: {

  },

  // POST /v1/Statuss
  updateSetting: {
    body: {
      casualShiftsSubscription: Joi.boolean().allow(null),
      casualShiftsAvailability: Joi.boolean().allow(null),
      profileVisibleToEmployer: Joi.boolean().allow(null),
      licenseVisibleToEmployer: Joi.boolean().allow(null),
      maxTravelDistance : Joi.number().allow(null),
      requireParking : Joi.string().valid('YES','NO','ANY','NA').allow(null),
      preferredShiftType : Joi.string().allow(null),
      maxShiftDuration : Joi.number().allow(null),
      notifyWhenShiftCreated : Joi.boolean().allow(null),
    }
  },

};
