const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  country:{
    type: mongoose.Schema.ObjectId,
    required: true,
    ref:"Country"
  },
  countryCode: {
    type: String,
    required: true,
    trim: true,
  },
  isoCode: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
 countrySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'dial_code', 'country','code'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 countrySchema.statics = {
  /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
  async get(id) {
    let choice;

    if (mongoose.Types.ObjectId.isValid(id)) {
      choice = await this.findById(id).exec();
    }
    if (choice) {
      return choice;
    }

    throw new APIError({
      message: 'Country does not exist',
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
    page = 1, perPage = 30, name,
  }) {
    const options = omitBy({ name }, isNil);

    return this.find(options)
      .skip(perPage * (page - 1))
      .limit(perPage)
      .sort({name:1})
      .exec();
  },
};
/**
 * @typedef SupportStatus
 */
module.exports = mongoose.model('State', countrySchema);
