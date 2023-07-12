const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const shiftLogsSchema = new mongoose.Schema({
    shiftId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Shift',
      required: true,
    },
    media:{
      type : String,
      required : false,
      default : null,
    },
    log: {
      type: String,
      required: true,
      trim: true,
    },
  }, {
    timestamps: true,
  });

  shiftLogsSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'shiftId', 'media', 'log', 'createdAt'];
  
      fields.forEach((field) => {
        transformed[field] = this[field];
      });
  
      return transformed;
    },
  });


/**
 * Statics
 */
 shiftLogsSchema.statics = {
    async get(id) {
      let log;
  
      if (mongoose.Types.ObjectId.isValid(id)) {
        log = await this.findOne({'shiftId':id}).exec();
      }
      if (log) {
        return log;
      }
  
      throw new APIError({
        message: 'Log does not exist',
        status: httpStatus.NOT_FOUND,
      });
    },
  
   
    list({
      page = 1, perPage = 30, shiftId, media, log, startDate, endDate
    }) {

      var createdAt = {};
      if(startDate !== undefined && startDate !== null && startDate !== '' && endDate !== undefined && endDate !== null && endDate !== ''){
        createdAt = {
          $gte : startDate,
          $lt : endDate
        };
      }
      else if(startDate !== undefined && startDate !== null && startDate !== ''){
        createdAt = {$gte : startDate};
      }

      else if(endDate !== undefined && endDate !== null && endDate !== ''){
        createdAt = {$lte: endDate};
      }

      if(createdAt // 👈 null and undefined check
      && Object.keys(createdAt).length === 0
      && Object.getPrototypeOf(createdAt) === Object.prototype){
        createdAt = null;
      }

      const options = omitBy({createdAt}, isNil);
      return this.find(options)
        .populate([
          {
            path : 'shiftId',
            model : 'Shift'
          }
        ])
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    },
  };
  /**
   * @typedef SupportStatus
   */
  module.exports = mongoose.model('SiftLogs', shiftLogsSchema,'shift_logs');
  
  