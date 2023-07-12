const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const areaSchema = new mongoose.Schema({
    floor:{
      type : String,
      required : true,
      default : null,
    },
    startTime:{
        type : Date,
        required : true,
        default : null,
    },
    endTime:{
        type : Date,
        required : false,
        default : null,
    },
    notes:{
        type:String,
        required:false
    }
  }, {
    timestamps: true,
  });

  areaSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'floor', 'startTime', 'endTime'];
  
      fields.forEach((field) => {
        transformed[field] = this[field];
      });
  
      return transformed;
    },
  });
  areaSchema.statics = {
    async get(id) {
      let log;
  
      if (mongoose.Types.ObjectId.isValid(id)) {
        log = await this.findById(id).exec();
      }
      if (log) {
        return log;
      }
  
      throw new APIError({
        message: 'Area does not exist',
        status: httpStatus.NOT_FOUND,
      });
    },
  
   
    list({
      page = 1, perPage = 30, startTime
    }) {
      const options = omitBy({startTime}, isNil);
  
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
  module.exports = mongoose.model('TenancyAreas', areaSchema);