const Joi = require('joi');

module.exports = {

  listMessages: {
  },

  deleteMessage: {

  },

  // POST /v1/Statuss
  updateMessage: {
    body: {
      // userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      // supportId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      title: Joi.string().min(3).required(),
      description: Joi.string().min(3).required(),
    },
  },

  replaceMessage: {
    body: {
      // userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      // supportId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      title: Joi.string().min(3).required(),
      description: Joi.string().min(3).required(),
    },
  },

  createMessage: {
    body: {
      // userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      // supportId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      title: Joi.string().min(3).required(),
      description: Joi.string().min(3).required(),
    },
  },

};
