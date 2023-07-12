const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listSites: {
    query: {
      documentId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/Statuss
  createSite: {
    body: {
      title: Joi.string().min(3).required(),
      keyword: Joi.string().min(3).required(),
      category: Joi.string().valid('HSW','Compliance','Operational','General','Mandatory','Other'),
      visibility: Joi.boolean().required(),
      siteId:Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      // document: Joi.any().required(),
    }
  },

  // PUT /v1/Statuss/:StatusId
  replaceSite: {
    body: {
      title: Joi.string().min(3).required(),
      keyword: Joi.string().min(3).required(),
      // document: Joi.any().required(),
    },
    params: {
      siteId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateSite: {
    body: {
      title: Joi.string().min(3).required(),
      keyword: Joi.string().min(3).required(),
      // document: Joi.any().required(),
    },
    params: {
      siteId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
