const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listLicense: {
    query: {
    },
  },

  // POST /v1/Statuss
  createLicense: {
    body: {
    user : Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    licenseName: Joi.string().min(3).required(),
    licenseNumber: Joi.string().min(3).required(),
    issuingAuthority: Joi.string().min(3).required(),
    issuingState: Joi.string().min(3).required(),
    country: Joi.string().min(3).required(),
    expiryDate: Joi.date().required(),
    picture: Joi.required(),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceLicense: {
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
  updateLicense: {
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
