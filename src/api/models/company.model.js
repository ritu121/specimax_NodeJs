const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
 * User Schema
 * @private
 */
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  countryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Country',
    required: true, // used by the toJSON plugin
  },
  cityId: {
    type: mongoose.Schema.ObjectId,
    ref: 'City',
    required: true,
  },
  roleId: {
    type: mongoose.Schema.ObjectId,
    ref: 'admin_roles',
    // required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  about :{
    type : String,
    default : null
  },
  otp: {
    type: Number,
    required: false,
    default: null,
  },
  type: {
    type: String,
    required: true,
    default:'client'
  },
  company :{
    type : mongoose.Schema.ObjectId,
    ref : "Company",
  }
}, {
  timestamps: true,
});

/**
 * Methods
 */
companySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'countryId','cityId','company','roleId','address', 'phone', 'about', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
  token() {
    const payload = {
      exp: moment().add(60000, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
      mob: this.phone
    };
    return jwt.encode(payload, jwtSecret);
  },
  async otpMatches(otp) {
    return otp === this.otp;
  },
});

/**
 * Statics
 */
companySchema.statics = {
  /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
  async get(id) {
    let company;

    if (mongoose.Types.ObjectId.isValid(id)) {
      company = await this.findById(id)
                          .populate([
                            {
                              path : 'countryId',
                              model : 'Country'
                            },
                            {
                              path : 'roleId',
                            },
                            {
                              path : "cityId",
                              model : "City"
                            },
                            {
                              path : 'company',
                              model : 'Company'
                            }
                          ])
                          .exec();
    }
    if (company) {
      return company;
    }

    throw new APIError({
      message: 'Company does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
  async findAndGenerateTokenByEmail(options) {
    const { email, otp, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (otp) {
      return { user, accessToken: user.token() };
      
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
     * List users in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
  list({
    page = 1, perPage = 25, name, type,company
  }) {
    const options = omitBy({ name,type, company }, isNil);

    return this.find(options)
      .populate([
        {
          path : 'countryId',
          model : 'Country'
        },
        {
          path : 'roleId',
        },
        {
          path : "cityId",
          model : "City"
        },
        {
          path : 'company',
          model : 'Company'
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};
/**
 * @typedef Support
 */
module.exports = mongoose.model('Company', companySchema);
