const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../errors/api-error');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
* User Roles
*/
const roles = ['user', 'admin', 'superadmin','schedular','company_user'];

/*  1-live, 2-site-team, 3-site-setting, 4- read-roster, 5-write-roster, 6-sitedoc, 7-siteoverviw, 8-inspection form,
9-guard,10 traker,11-timesheet, 12-schedular, 13-reports, 14-users, 15-alert, 16-safetytip,17.app, 18-notifications,19-FAQ, 18-support
*/
const permissions = [ ]

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
 
  firstname: {
    type: String,
    maxlength: 128,
    trim: true,
  },
  lastname: {
    type: String,
    maxlength: 128,
    trim: true,
  },
  
  picture: {
    type: String,
    trim: true,
    default: null,
  },
  phone: {
    type: Number,
    required: false,
    default: null,
  },
  country: {
    type: mongoose.Schema.ObjectId,
    ref: 'Country',
    required: false,
    default : null
  },
  postcode: {
    type: Number,
    required: false,
    default: null,
  },
  about: {
    type: String,
    required: false,
    default: null,
  },
  gender: {
    type: String,
    // enum:['Male','Female','Prefer Not to say'],
    required: false,
    // default: null,
  },
  
  agreeTermAndCondition: {
    type: Boolean,
    required: false,
    default: false,
  },
  agreeWithPrivacyPolicy: {
    type: Boolean,
    required: false,
    default: false,
  },
  otp: {
    type: Number,
    required: false,
    default: null,
  },
  company :{
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: false,
  },
  
  jobDecription :{
    type: String,
    default: "",
    required: false,
  },
  deviceToken :{
    type: String,
    default: null,
    required: false,
  },
  duration :{
    type: String,
    required: false,
  },
  experiences:[{
      type: mongoose.Schema.ObjectId,
      ref: 'UserExperience',
  }],
  isVerified:{
    type:Boolean,
    default:false
  },
  
  licenseNumber: {
    type: String,
    required: false,
    default: null,
  },
  expiryDate: {
    type: Date,
    required: false,
    default: null,
  },
  sites: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Site',
  }],
  stripeId: {
    type:String,
    default:""
  },
  isDeleted: {
    type:Boolean,
    default:false
  },
 
  address : {
    type:String,
    default : null,
    required : false
  },
  business : {
    type:String,
    default : null,
    required : false
  },
  role : {
    type:String,
    default : null,
    required : false
  },
  latitude : {
    type:String,
    default : null,
    required : false
  },
  longitude : {
    type:String,
    default : null,
    required : false
  }
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = env === 'test' ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});


userSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email','firstname', 'lastname', 'picture', 'role', 'phone', 'country', 'postcode', 'about', 'licenseNumber', 'expiryDate', 'agreeTermAndCondition','experiences', 'agreeWithPrivacyPolicy','business','role','login_as', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const payload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
      mob: this.phone
    };
    return jwt.encode(payload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
  async otpMatches(otp) {
    return otp === this.otp;
  },
});

/**
 * Statics
 */
userSchema.statics = {
  roles,
  async get(id) {
    let user;

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }

    throw new APIError({
      message: 'User does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (user && await user.passwordMatches(password)) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  async findAndGenerateTokenByEmail(options) {
    const { email, otp, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (otp) {
      return { user, accessToken: user.token() };
      // if (user && await user.otpMatches(otp)) {
      // }
      // err.message = 'Incorrect email or otp';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    page = 1, perPage = 25, name, email, role, isDeleted
  }) {
    const options = omitBy({ name, email, role, isDeleted, login_as : {$nin : ['CLIENT','COMPANY_CLIENT','COMPANY_USER','CLIENT_USER']} }, isNil);

    return this.find(options)
      .populate([
        {
          path :"country",
          model : 'Country'
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
      });
    }
    return error;
  },

  async oAuthLogin({
    service, id, email, name, picture,
  }) {
    const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      if (!user.picture) user.picture = picture;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id }, email, password, name, picture,
    });
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('Visitors', userSchema);
