const Joi = require('joi');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/users
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(User.roles),
    },
  },

  // POST /v1/users
  createUser: {
    // body: {
    //   email: Joi.string().email().required(),
    //   password: Joi.string().min(6).max(128).required(),
    //   name: Joi.string().max(128),
    //   role: Joi.string().valid(User.roles),
    // },
    body: {
      firstname: Joi.string()
        .min(3)
        .required(),
      lastname: Joi.string()
        .min(3)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      phone: Joi.string()
        .min(12)
        .max(14)
        .required(),
      country: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
      // postcode: Joi.number()
      //   .min(6)
      //   .required(),
      about: Joi.string()
        .allow(null),
      agreeTermAndCondition: Joi.boolean() 
        .valid(true)
        .required(),
      agreeWithPrivacyPolicy: Joi.boolean() 
        .valid(true)
        .required(),
      // login_as: Joi.string()
      //   .valid('GUARD','CLEANER'),
    },
  },
  createAdminUser: {
    // body: {
    //   email: Joi.string().email().required(),
    //   password: Joi.string().min(6).max(128).required(),
    //   name: Joi.string().max(128),
    //   role: Joi.string().valid(User.roles),
    // },
    body: {
      firstname: Joi.string()
        .min(3)
        .required(),
      lastname: Joi.string()
        .min(3)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      phone: Joi.string()
        .min(12)
        .max(14)
        .required(),
      // country: Joi.string()
      //   .regex(/^[a-fA-F0-9]{24}$/)
      //   .required(),
      // postcode: Joi.number()
      //   .min(6)
      //   .required(),
      about: Joi.string()
        .allow(null),
      // agreeTermAndCondition: Joi.boolean() 
      //   .valid(true)
      //   .required(),
      // agreeWithPrivacyPolicy: Joi.boolean() 
      //   .valid(true)
      //   .required(),
      // login_as: Joi.string()
      //   .valid('GUARD','CLEANER'),
    },
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
