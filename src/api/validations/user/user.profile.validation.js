const Joi = require('joi');

module.exports = {

  // GET /v1/user/status
  getProfile: {

  },

  deleteProfile: {
   body :{
    // firstname: Joi.string().min(3).required(),
    // lastname: Joi.string().min(3).required(),
    // // email: Joi.string().email().required(),
    // phone: Joi.string().min(12).max(14).required(),
    // country: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    // postcode: Joi.number().min(6).required(),
    // about: Joi.string().allow(null),
    // company: Joi.string().regex(/^[a-fA-F0-9]{24}$/).allow(null),
    // companyRole: Joi.string().regex(/^[a-fA-F0-9]{24}$/).allow(null),
    // jobDescription : Joi.string().allow(null),
   }
  },

  // POST /v1/Statuss
  updateProfile: {
    body: {
      firstname: Joi.string().min(3).required(),
      lastname: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      // phone: Joi.string().min(12).max(14),
      country: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
      postcode: Joi.number().min(6),
      login_as : Joi.string().optional().valid('GUARD','CLEANER'),
      about: Joi.string().allow(null),
      licenseNumber : Joi.string().min(8).allow('').allow(null),
      expiryDate : Joi.date().allow(null),
      experience: Joi.array().items(Joi.object({
        employer : Joi.string().required(),
        role : Joi.string().required(),
        jobDecription : Joi.string().allow(null),
        duration : Joi.string().allow(null),
      })),
    },
  },

};
