const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const tenancyCheckSchema = new mongoose.Schema({
    shiftId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Shift',
      required: true,
    },
    shiftStatus:{
        type: String,
        required: true,
        default:'Saved'
    },
    floors:[{
        type : mongoose.Schema.ObjectId,
        ref : 'TenancyAreas',
      }],
  }, {
    timestamps: true,
  });

  tenancyCheckSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'shiftId', 'shiftStatus','floors'];
  
      fields.forEach((field) => {
        transformed[field] = this[field];
      });
  
      return transformed;
    },
  });


/**
 * Statics
 */
 tenancyCheckSchema.statics = {
    async get(id) {
      let log;
  
      if (mongoose.Types.ObjectId.isValid(id)) {
        log = await this.findOne({'shiftId':id,'shiftStatus':"Saved"})
        .populate([
            {
            path : 'floors',
            model : 'TenancyAreas'
            },
        ])
        .exec();
      }
      if (log) {
        return log;
      }
  
      const newTenancy =  new this({'shiftId':id})
        const saveTenancy = await newTenancy.save()
        return saveTenancy
    },
  
   
    list({
      page = 1, perPage = 30, shiftId , startDate, endDate
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

      const options = omitBy({ shiftId, createdAt}, isNil);

      return this.find(options)
        .populate('shiftId floors')
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    },
  };
  /**
   * @typedef SupportStatus
   */
  module.exports = mongoose.model('TenancyCheck', tenancyCheckSchema);
  
  