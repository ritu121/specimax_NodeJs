const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listSkills: {
    query: {
    //   title: Joi.string().min(3),
    },
  },

  // POST /v1/Statuss
  createSkill: {
    body: {
        skill: Joi.string().min(3).required(),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceSkill: {
    body: {
      skill: Joi.string().min(3).required(),
    },
    params: {
        skillId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateSkill: {
    body: {
      skill: Joi.string().min(3).required(),
    },
    params: {
        skillId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
