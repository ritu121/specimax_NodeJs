const Joi = require('joi');

module.exports = {

  // GET /v1/user/status
  listLicenses: {
  },

  deleteLicense: {

  },

  // POST /v1/Statuss
  updateLicense: {
    body: {
      licenseName: Joi.string().min(3).required(),
      licenseNumber: Joi.string().min(3).required(),
      issuingAuthority: Joi.string().min(3).required(),
      issuingState: Joi.string().min(1).required(),
      country: Joi.string().min(3).required(),
      expiryDate: Joi.date().required(),
      picture: Joi.any().meta({swaggerType: 'file'})
    },
  },

  replaceLicense: {
    body: {
      licenseName: Joi.string().min(3).required(),
      licenseNumber: Joi.string().min(3).required(),
      issuingAuthority: Joi.string().min(3).required(),
      issuingState: Joi.string().min(3).required(),
      country: Joi.string().min(3).required(),
      expiryDate: Joi.date().required(),
      picture: Joi.any().meta({swaggerType: 'file'})
    },
  },

  createLicense: {
    body: {
      licenseName: Joi.string().min(3).required(),
      licenseNumber: Joi.string().min(3).required(),
      issuingAuthority: Joi.string().min(3).required(),
      issuingState: Joi.string().min(1).required(),
      country: Joi.string().min(3).required(),
      expiryDate: Joi.date().required(),
      picture: Joi.any().meta({swaggerType: 'file'})
    },
  },

};
