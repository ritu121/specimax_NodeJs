const httpStatus = require('http-status');
const { omit } = require('lodash');
const Site = require('../models/site.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const site = await Site.get(id);
    req.locals = { site };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => {
  Site.findOne({_id : req.params.locId})
    .populate([
      {
        path : 'companyId',
        model : 'Company',
        populate: ['cityId','countryId']
      },
      {
        path : 'city',
        model : 'City'
      },
      {
        path : 'country',
        model : 'Country'
      }
    ])
    .then((site) => {
      res.json({code: 201, message: 'Site retrieved successfully.', data: site});
    })
    .catch((errors) => {
      res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
    });
    
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.site.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const site = new Site(req.body);
    const savedSite = await site.save();
    Site.findOne({_id : savedSite._id})
    .populate([
      {
        path : 'companyId',
        model : 'Company'
      }
    ])
    .then((site) => {
      res.json({code: 201, message: 'Site created successfully.', data: site});
    })
    .catch((errors) => {
      res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
    });
    
  }
  catch (error) {
    next(error);
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { site } = req.locals;
    const newSite = new Site(req.body);
    const newSiteObject = omit(newSite.toObject(), '_id');

    await site.updateOne(newSiteObject, { override: true, upsert: true });
    const savedSite = await site.findById(site._id);

    res.json({code: 200, message: 'Site updated successfully.', data: savedSite.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedSite = omit(req.body);
  const site = Object.assign(req.locals.site, updatedSite);

  site.save()
    .then((site) => res.json({code : 200, message : 'Site updated successfully.', data: site.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    
    if(req.user.login_as === 'CLIENT' || req.user.login_as === 'CLIENT_USER'){
      let options = {_id:{$in:req.user.sites}}
      if(req.query.companyId){
        options['companyId']=req.query.companyId
      }
      Site.find(options)
      .populate([
        {
          path : 'companyId',
          model : 'Company',
          populate: ['cityId','countryId']
        },
        {
          path : 'city',
          model : 'City'
        },
        {
          path : 'country',
          model : 'Country'
        }
      ])
      .then((sites) => {
        res.json({code: 201, message: 'Site list retrieved successfully.', data: sites});
      })
      .catch((errors) => {
        res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
      });
    }
    else{
      let options={}
      if(req.query.companyId){
        options['companyId']=req.query.companyId
      }
      Site.find(options)
      .populate([
        {
          path : 'companyId',
          model : 'Company',
          populate: ['cityId','countryId']
        },
        {
          path : 'city',
          model : 'City'
        },
        {
          path : 'country',
          model : 'Country'
        }
      ])
      .then((sites) => {
        res.json({code: 201, message: 'Site list retrieved successfully.', data: sites});
      })
      .catch((errors) => {
        res.json(500, {code: 500, message: 'Internal server error.', errors : errors})
      });
    }
    
  } catch (error) {
    next(error);
  }
};


/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { site } = req.locals;

  site.remove()
  .then(() => res.json({code : 200, message : 'Site delete successfully.', data : {}}))
    .catch((e) => next(e));
};
