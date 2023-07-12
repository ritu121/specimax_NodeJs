const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const breakSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true,
    },
    endTime:{
        type:Date,
        required: true
    }
}, {
  timestamps: true,
});

breakSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'startTime', 'endTime'];
  
      fields.forEach((field) => {
        transformed[field] = this[field];
      });
  
      return transformed;
    },
  });
  
  /**
   * Statics
   */
   breakSchema.statics = {
    /**
       * Get user
       *
       * @param {ObjectId} id - The objectId of user.
       * @returns {Promise<User, APIError>}
       */
    async get(id) {
      let breaks;
  
      if (mongoose.Types.ObjectId.isValid(id)) {
        breaks = await this.findById(id).exec();
      }
      if (breaks) {
        return breaks;
      }
  
      throw new APIError({
        message: 'Breaks does not exist',
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
      page = 1, perPage = 30, shiftId,startTime,endTime
    }) {
      const options = omitBy({ startTime,endTime }, isNil);
  
      return this.find(options)
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    },
  };
  /**
   * @typedef SupportStatus
   */
  module.exports = mongoose.model('Break', breakSchema);
  