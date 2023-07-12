const Joi = require('joi');

module.exports = {

  // GET /v1/user/status
  listCategory: {
  },

  deleteCategory: {

  },

  // POST /v1/Statuss
  updateCategory: {
    // body: {
    //   licenseName: Joi.string().min(3).required(),
    //   licenseNumber: Joi.string().min(3).required(),
    //   issuingAuthority: Joi.string().min(3).required(),
    //   issuingState: Joi.string().min(1).required(),
    //   country: Joi.string().min(3).required(),
    //   expiryDate: Joi.date().required(),
    //   picture: Joi.any().meta({swaggerType: 'file'})
    // },
  },

  replaceCategory: {
    // body: {
    //   licenseName: Joi.string().min(3).required(),
    //   licenseNumber: Joi.string().min(3).required(),
    //   issuingAuthority: Joi.string().min(3).required(),
    //   issuingState: Joi.string().min(3).required(),
    //   country: Joi.string().min(3).required(),
    //   expiryDate: Joi.date().required(),
    //   picture: Joi.any().meta({swaggerType: 'file'})
    // },
  },

  createCategory: {
    // body: {
    //   licenseName: Joi.string().min(3).required(),
    //   licenseNumber: Joi.string().min(3).required(),
    //   issuingAuthority: Joi.string().min(3).required(),
    //   issuingState: Joi.string().min(1).required(),
    //   country: Joi.string().min(3).required(),
    //   expiryDate: Joi.date().required(),
    //   picture: Joi.any().meta({swaggerType: 'file'})
    // },
  },

};