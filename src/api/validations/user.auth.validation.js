const Joi = require('joi');

module.exports = {
  // POST /v1/auth/register
  register: {
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
      // password: Joi.string()
      //   .required()
      //   .min(6)
      //   .max(128),
      phone: Joi.string()
        // .min(12)
        // .max(14)
        .required(),
      country: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
      postcode: Joi.number()
        .min(6)
        .required(),
      gender: Joi.string()
        .required(),
      agreeTermAndCondition: Joi.boolean() 
        .valid(true)
        .required(),
      agreeWithPrivacyPolicy: Joi.boolean() 
        .valid(true)
        .required(),
      login_as: Joi.string()
        .valid('GUARD','CLEANER'),
    },
  },
  verifySignup: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      otp: Joi.number()
        .min(4)
        .required()
        
    },
  },

  // POST /v1/auth/login
  login: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      otp: Joi.number()
        .min(4)
        .required()

    },
  },

   // POST /v1/auth/login
   otp: {
    body: {
      email: Joi.string()
        .email()
        .required(),
    },
  },

  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: {
    body: {
      access_token: Joi.string().required(),
    },
  },

  // POST /v1/auth/refresh
  refresh: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      refreshToken: Joi.string().required(),
    },
  },

  // POST /v1/auth/refresh
  sendPasswordReset: {
    body: {
      email: Joi.string()
        .email()
        .required(),
    },
  },

  // POST /v1/auth/password-reset
  passwordReset: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(6)
        .max(128),
      resetToken: Joi.string().required(),
    },
  },
};
