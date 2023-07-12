const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../errors/api-error');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
const { boolean } = require('joi');
/**
 * User Schema
 * @private
 */
const userGpsSettingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  gpsTrackingDuringShift: {
    type: Boolean,
    required : true,
    default : false,
  },
  gpsTrackingHistory: {
    type: Boolean,
    required : true,
    default : false,
  },
  allowClientViewGpsTracking: {
    type: Boolean,
    required : true,
    default : false,
  },
}, {
  timestamps: true,
});


/**
 * Methods
 */
 userGpsSettingSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'user', 'gpsTrackingDuringShift', 'gpsTrackingHistory', 'allowClientViewGpsTracking'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

});

/**
 * Statics
 */
 userGpsSettingSchema.statics = {
  async get(id) {
    let user;

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }

    throw new APIError({
      message: 'Gps setting does not exist',
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
module.exports = mongoose.model('UserGpsSetting', userGpsSettingSchema, 'user_gps_settings');
