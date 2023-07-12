const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const siteSpecificInductionSchema = new mongoose.Schema({
  siteInduction: {
    type: mongoose.Schema.ObjectId,
    ref: 'SiteSpecificInduction',
    required: true,
  },
  isChecked: {
    type:Boolean,
    default:false
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
  
}, {
  timestamps: true,
});


 siteSpecificInductionSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'siteInduction', 'isChecked', 'userId','updatedAt', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


 siteSpecificInductionSchema.statics = {
  async get(id) {
    let choice;

    if (mongoose.Types.ObjectId.isValid(id)) {
      choice = await this.findById(id).exec();
    }
    if (choice) {
      return choice;
    }

    throw new APIError({
      message: 'Site specific induction does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 30, siteInduction, userId
  }) {
    const options = omitBy({ siteInduction,userId }, isNil);

    return this.find(options)
      .sort({ createdAt: 'asc' })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('UserInductionStatus', siteSpecificInductionSchema,'user_induction_status');
