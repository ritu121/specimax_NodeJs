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
const userLicenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  licenseName: {
    type: mongoose.Schema.ObjectId,
    ref: 'LicenseType',
    required : true,
  },
  licenseNumber: {
    type: String,
    required : true,
  },
  issuingAuthority: {
    type: String,
    required : true,
  },
  issuingState: {
    type: mongoose.Schema.ObjectId,
    ref: 'State',
    required : true,
  },
  country: {
    type: mongoose.Schema.ObjectId,
    ref: 'Country',
    required : true,
  },
  picture: {
    type: String,
    required : false,
  },
  expiryDate: {
    type: Date,
    required : true,
  },
}, {
  timestamps: true,
});


/**
 * Methods
 */
 userLicenseSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'user', 'licenseName', 'licenseNumber', 'issuingAuthority', 'issuingAuthority', 'issuingState', 'country', 'picture', 'expiryDate'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

});

/**
 * Statics
 */
 userLicenseSchema.statics = {
  async get(id) {
    let user;

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id)
      .populate([
        {
          path: 'licenseName',
          model: 'LicenseType'
        },
        {
          path: 'country',
          model: 'Country'
        }
      ])
      .exec();
    }
    if (user) {
      return user;
    }

    throw new APIError({
      message: 'License does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  list({
    page = 1, perPage = 30, user,
  }) {
    const options = omitBy({ user }, isNil);

    return this.find(options)
      .populate([
        {
          path: 'licenseName',
          model: 'LicenseType'
        },
        {
          path: 'country',
          model: 'Country'
        },
        {
          path: 'issuingState',
          model: 'State'
        },
        {
          path: 'user',
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('UserLicense', userLicenseSchema, 'user_licenses');
