const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listSupports: {
    query: {
    //   checkIn: Joi.date().iso().required(),
    //   checkOut: Joi.date().iso().required(),
    //   statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    //   userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/Statuss
  createSupport: {
    body: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      issueDate: Joi.date().iso().allow(null).default(null),
      closeDate: Joi.date().iso().allow(null).default(null),
      issue: Joi.string().min(10).required(),
      statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).default('62c79b6a75125e6d08b6dac8'),
    },
  },


  createUserSupport: {
    body: {
      title: Joi.string().min(3).required(),
      issue: Joi.string().min(10).required(),
      issueDate: Joi.date().iso().allow(null).default(new Date()),
      closeDate: Joi.date().iso().allow(null).default(null),
      statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).default('62c79b6a75125e6d08b6dac8'),
    },
  },

  updateUserSupport: {
    body: {
      title: Joi.string().min(3).required(),
      issue: Joi.string().min(10).required(),
      issueDate: Joi.date().iso().allow(null).default(new Date()),
      closeDate: Joi.date().iso().allow(null).default(null),
      statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).default('62c79b6a75125e6d08b6dac8'),
    },
  },

 
  // PUT /v1/Statuss/:StatusId
  replaceSupport: {
    body: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      issueDate: Joi.date().iso().allow(null).default(null),
      closeDate: Joi.date().iso().allow(null).default(null),
      issue: Joi.string().min(10).required(),
      statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).allow(null).default(null),
    },
    params: {
      supportId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateSupport: {
    body: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      issueDate: Joi.date().iso().allow(null).default(null),
      closeDate: Joi.date().iso().allow(null).default(null),
      issue: Joi.string().min(10).required(),
      statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).allow(null).default(null),
    },
    params: {
      supportId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
