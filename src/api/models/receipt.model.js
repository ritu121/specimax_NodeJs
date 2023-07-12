const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const receiptSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    invoiceNo: {
      type:String,
    },
    amount: {
      type:String
    },
    fee: {
        type:String
    },
    media: {
        type:String
    }
  }, {
    timestamps: true,
  });

  receiptSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'email', 'invoiceNo', 'amount', 'fee'];
  
      fields.forEach((field) => {
        transformed[field] = this[field];
      });
  
      return transformed;
    },
  });
  
  /**
   * Statics
   */
  receiptSchema.statics = {
    /**
       * Get user
       *
       * @param {ObjectId} id - The objectId of user.
       * @returns {Promise<User, APIError>}
       */
    async get(id) {
      let report;
  
      if (mongoose.Types.ObjectId.isValid(id)) {
        report = await this.findById(id).exec();
      }
      if (report) {
        return report;
      }
  
      throw new APIError({
        message: 'Report does not exist',
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
      page = 1, perPage = 30, date, userId
    }) {
      const options = omitBy({ createdAt:date, userId }, isNil);
  
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
  module.exports = mongoose.model('Receipt', receiptSchema);