const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const trackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  day: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
trackerSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'user', 'latitude', 'longitude', 'place', 'time', 'day', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 trackerSchema.statics = {
    /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id) {
      let tracker;
  
      if (mongoose.Types.ObjectId.isValid(id)) {
        tracker = await this.findById(id).exec();
      }
      if (tracker) {
        return tracker;
      }
  
      throw new APIError({
        message: 'Tracker does not exist',
        status: httpStatus.NOT_FOUND,
      });
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({
      page = 1, perPage = 30, place, time, day,
    }) {
      const options = omitBy({ place, time, day }, isNil);
  
      return this.find(options)
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    },
  };
/**
 * @typedef Tracker
 */
module.exports = mongoose.model('Tracker', trackerSchema);
