const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listFaqs: {
    query: {
    //   title: Joi.string().min(3),
    },
  },

  // POST /v1/Statuss
  createFaq: {
    body: {
        title: Joi.string().min(3).required(),
        description : Joi.string().min(10).required(),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceFaq: {
    body: {
      title: Joi.string().min(3).required(),
      description : Joi.string().min(10).required(),
    },
    params: {
        faqId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateFaq: {
    body: {
      title: Joi.string().min(3).required(),
      description : Joi.string().min(10).required(),
    },
    params: {
        faqId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
