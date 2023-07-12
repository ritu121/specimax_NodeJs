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
      companyId : Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      roleId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      phone: Joi.string().min(10).allow(null)
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceCompany: {
    body: {
      companyId : Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      roleId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).allow(null)
    },
    params: {
      companyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateCompany: {
    body: {
      companyId : Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      roleId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).allow(null)
    },
    params: {
      companyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
