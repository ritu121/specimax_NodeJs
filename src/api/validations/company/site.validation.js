const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listSites: {
    query: {
    //   checkIn: Joi.date().iso().required(),
    //   checkOut: Joi.date().iso().required(),
    //   statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    //   userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/Statuss
  createSite: {
    body: {
      name: Joi.string().min(3).required(),
      address: Joi.string().min(10).required(),
      city: Joi.string().min(2).required(),
      latitude: Joi.string().min(2).required(),
      longitude: Joi.string().min(2).required(),
    //   phone: Joi.string().length(10).pattern(/^[0-9]+$/).required().allow(null)
    //     .default(null),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceSite: {
    body: {
      name: Joi.string().min(3).required(),
      address: Joi.string().min(10).required(),
      city: Joi.string().min(2).required(),
      latitude: Joi.string().min(2).required(),
      longitude: Joi.string().min(2).required(),
    //   phone: Joi.string().length(10).pattern(/^[0-9]+$/).required().allow(null)
    //     .default(null),
    },
    params: {
      locId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateSite: {
    body: {
      name: Joi.string().min(3).required(),
      address: Joi.string().min(10).required(),
      city: Joi.string().min(2).required(),
      latitude: Joi.string().min(2).required(),
      longitude: Joi.string().min(2).required(),
    //   phone: Joi.string().length(10).pattern(/^[0-9]+$/).required().allow(null)
    //     .default(null),
    },
    params: {
      locId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
