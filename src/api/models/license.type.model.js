const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const licenseTypeSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    default : null,
  },
  state:{
    type:mongoose.Schema.ObjectId,
    default:"State"
  },
  country:{
    type:mongoose.Schema.ObjectId,
    default:"Country"
  },
  type: {
    type:String,
    default: "Security",
    enum: ['Security','Other']
  }
}, {
  timestamps: true,
});


 licenseTypeSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name','state','country','type'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


 licenseTypeSchema.statics = {
  async get(id) {
    let choice;

    if (mongoose.Types.ObjectId.isValid(id)) {
      choice = await this.findById(id).exec();
    }
    if (choice) {
      return choice;
    }

    throw new APIError({
      message: 'License does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 30, state, country, type
  }) {
    const options = omitBy({ country, state, type }, isNil);

    return this.find(options)
      .populate([
        {
          path : 'country',
          model : 'Country'
        },
        {
          path : 'state',
          model : 'State'
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('LicenseType', licenseTypeSchema);
