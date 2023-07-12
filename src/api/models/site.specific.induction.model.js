const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const siteSpecificInductionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  keyword:{
    type: String,
    required: true,
    trim: true,
  },
  document: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  visibility: {
    type: Boolean,
    required: true,
    default:true
  },
  isMandatory: {
    type: Boolean,
    required: true,
    default:false
  },
  siteId:{
    type: mongoose.Schema.ObjectId,
    ref: 'Site',
    required: true,
  },
  mediaType: {
    type:String,
  },
}, {
  timestamps: true,
});


 siteSpecificInductionSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'title', 'keyword', 'category','mediaType','visibility','siteId', 'isMandatory','document', 'createdAt'];

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
    page = 1, perPage = 30, title, keyword, document, siteId
  }) {
    const options = omitBy({ title, keyword, document, siteId }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('SiteSpecificInduction', siteSpecificInductionSchema,'site_specific_inductions');
