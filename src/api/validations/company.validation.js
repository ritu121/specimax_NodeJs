const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listCompanies: {
    query: {
    //   checkIn: Joi.date().iso().required(),
    //   checkOut: Joi.date().iso().required(),
    //   statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    //   userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/Statuss
  createCompany: {
    body: {
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      countryId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      cityId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      address: Joi.string().min(6).required(),
      phone: Joi.string().min(10).allow(null),
      about: Joi.string().min(10).valid(null),
      // roleId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceCompany: {
    body: {
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      countryId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      cityId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      address: Joi.string().min(6).required(),
      phone: Joi.string().min(10).allow(null),
      about: Joi.string().min(10).valid(null),
    },
    params: {
      companyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateCompany: {
    body: {
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      countryId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      cityId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      address: Joi.string().min(6).required(),
      phone: Joi.string().min(10).allow(null),
      about: Joi.string().min(10).valid(null),
    },
    params: {
      companyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
