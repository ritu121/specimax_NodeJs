const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const citySchema = new mongoose.Schema({
  countryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Country',
    required: true,
  },
  name: {
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
 citySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'countryId', 'name', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 citySchema.statics = {
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
      message: 'City does not exist',
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
    const options = omitBy({  name }, isNil);

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
module.exports = mongoose.model('City', citySchema);
