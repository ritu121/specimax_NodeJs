const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const clockDataSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    userId:{
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required: true
      },
    siteId:{
      type : mongoose.Schema.ObjectId,
      ref : 'Site',
      required: false,
      default : null
    },
    shiftId:{
        type : mongoose.Schema.ObjectId,
        // ref : 'CasualShift',
        ref: 'Shift',
        required: true
    },
    breakDuration:{
        type : Number,
        default:0,
        required: true
    },
    status:{
      type:String,
      default:"Open",
    }
}, {
  timestamps: true,
});

clockDataSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'type', 'userId','shiftId','breakDuration','status','createdAt'];
  
      fields.forEach((field) => {
        transformed[field] = this[field];
      });
  
      return transformed;
    },
  });
  
  /**
   * Statics
   */
   clockDataSchema.statics = {
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
      page = 1, perPage = 30, time,status
    }) {
      const options = omitBy({ time,status }, isNil);
  
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
  module.exports = mongoose.model('ClockData', clockDataSchema);
  