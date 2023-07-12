const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../errors/api-error');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
 * User Schema
 * @private
 */
const userShiftAvailabilitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  day: {
    type: String,
    required : true
  },
  dayId: {
    type: Number,
    required : true
  },
  startTime: {
    type: String,
    required : true
  },
  endTime: {
    type: String,
    required : true
  },
  availability:{
    type: Boolean,
    required : true,
    default : false
  }
}, {
  timestamps: true,
});


/**
 * Methods
 */
 userShiftAvailabilitySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'user', 'day', 'dayId', 'startTime', 'endTime'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

});

/**
 * Statics
 */
 userShiftAvailabilitySchema.statics = {
  async get(id) {
    let user;

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }

    throw new APIError({
      message: 'Setting does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  list({
    page = 1, perPage = 30, user,
  }) {
    const options = omitBy({ user }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('UserShiftAvailability', userShiftAvailabilitySchema, 'user_shifts_availabilities');
