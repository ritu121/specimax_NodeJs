const Joi = require('joi');

module.exports = {

  // GET /v1/Statuss
  listTimesheets: {
    query: {
    //   checkIn: Joi.date().iso().required(),
    //   checkOut: Joi.date().iso().required(),
    //   statusId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    //   userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/Statuss
  createTimesheet: {
    body: {
      // userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      startTime: Joi.date().iso().allow(null).default(null),
      endTime: Joi.date().iso().allow(null).default(null),
    },
  },

  // PUT /v1/Statuss/:StatusId
  replaceTimesheet: {
    body: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      checkIn: Joi.date().iso().required(),
      checkOut: Joi.date().iso().required(),
    },
    params: {
      timesheetId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/Statuss/:StatusId
  updateTimesheet: {
    body: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      checkIn: Joi.date().iso().required(),
      checkOut: Joi.date().iso().required(),
    },
    params: {
      timesheetId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
