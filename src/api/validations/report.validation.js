const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listReports: {
    query: {
    //   questionId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    //   choiceId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    //   discription: Joi.string().min(10).required(),
    },
  },

  // POST /v1/Statuss
  createReport: {
    body: {
      reportTypeId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      questions: Joi.array().items(Joi.object({
        questionId : Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        answer : Joi.string().valid('YES','NO','NA').required(),
        comment : Joi.string().allow(""),
      })),
      note: Joi.string(),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceReport: {
    body: {
      reportTypeId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      taskId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      // questions: Joi.array().items(
      //   Joi.object({
      //   questionId : Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      //   answer : Joi.string().valid('YES','NO').required(),
      //   comment : Joi.string().allow(null),
      // })),
      note: Joi.string().min(10).required(),
    },
    params: {
      reportId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateReport: {
    body: {
      reportTypeId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      taskId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      questions: Joi.array().required().items(Joi.object({
        questionId : Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        answer : Joi.string().valid('YES','NO').required(),
        comment : Joi.string().allow(null),
      })),
      note: Joi.string().min(10).required(),
    },
    params: {
      reportId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
