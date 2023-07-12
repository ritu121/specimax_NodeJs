const Joi = require('joi');
const Tracker = require('../models/tracker.model');

module.exports = {

  // GET /v1/trackers
  listTrackers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      place: Joi.string(),
      time: Joi.string(),
      day: Joi.string(),
    },
  },

  // POST /v1/trackers
  createTracker: {
    body: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      latitude: Joi.string().required(),
      longitude: Joi.string().required(),
      place: Joi.string().required(),
      time: Joi.string().required(),
      day: Joi.date().required(),
    },
  },

  // PUT /v1/trackers/:trackerId
  replaceTracker: {
    body: {
        userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        latitude: Joi.string().required(),
        longitude: Joi.string().required(),
        place: Joi.string().required(),
        time: Joi.string().required(),
        day: Joi.date().required(),
    },
    params: {
      trackerId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/trackers/:trackerId
  updateTracker: {
    body: {
        userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        latitude: Joi.string().required(),
        longitude: Joi.string().required(),
        place: Joi.string().required(),
        time: Joi.string().required(),
        day: Joi.date().required(),
    },
    params: {
      trackerId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
