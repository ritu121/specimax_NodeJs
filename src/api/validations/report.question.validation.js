const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listQuestions: {
    query: {
      name: Joi.string().min(3),
    },
  },

  // POST /v1/Statuss
  createQuestion: {
    body: {
        question: Joi.string().min(3),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceQuestion: {
    body: {
      question: Joi.string().min(3),
    },
    params: {
        questionId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateQuestion: {
    body: {
      question: Joi.string().min(3),
    },
    params: {
        questionId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
