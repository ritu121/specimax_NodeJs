const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
 * User Schema
 * @private
 */
const companySchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true, // used by the toJSON plugin
    },

    clients: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
    }],
    sites: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Site',
    }]
}, {
    timestamps: true,
});

/**
 * Methods
 */
companySchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'vendor', 'clients', 'sites'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    }

});

/**
 * Statics
 */
companySchema.statics = {
    /**
       * Get user
       *
       * @param {ObjectId} id - The objectId of user.
       * @returns {Promise<User, APIError>}
       */
    async get(id) {
        let company;

        if (mongoose.Types.ObjectId.isValid(id)) {
            company = await this.findById(id).exec();
        }
        if (company) {
            return company;
        }

        throw new APIError({
            message: 'Company does not exist',
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
        page = 1, perPage = 30, name, type, vendor
    }) {
        const options = omitBy({ name, type, vendor }, isNil);

        return this.find(options)
            .populate([
                {
                    path: 'clients',
                    populate: [{
                        path: 'countryId'
                    },
                    {
                        path: 'cityId'
                    }
                    ],
                },
                {
                    path: 'sites',
                },
            ])
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },
};
/**
 * @typedef Support
 */
module.exports = mongoose.model('VendorClients', companySchema);
