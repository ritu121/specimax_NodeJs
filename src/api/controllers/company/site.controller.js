const httpStatus = require('http-status');
const { omit } = require('lodash');
const Site = require('../../models/site.model');


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
    // req.companyId = req.user._id;
    var payload = {
      companyId : req.user._id,
      name : req.body.name,
      address : req.body.address,
      city : req.body.city,
      country: req.body.country,
      latitude : req.body.latitude,
      longitude : req.body.longitude
    }
    const site = new Site(payload);
    const savedSite = await site.save();
    Site.findOne({_id : savedSite._id})
    .populate([
      {
        path : 'companyId',
        model : 'Company'
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
  const query = {
    _id : req.params.locId
  }

  Site.updateOne(query, updatedSite, (err, site) => {
    if(err) res.json(500, {code : 500, message : 'Internal server error', errors : err})
    if(site){
      Site.findOne(query)
      .populate([
        {
          path : 'companyId',
          model : 'Company'
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
      .then((data) => {
        res.json(200, {code : 200, message : 'Site updated successfully', data : data})
      })
      .catch((error) => {
        res.json(500, {code : 500, message : 'Internal server error', errors : errors})
      })
    }
    else{
      res.json(404, {code : 404, message : 'Site not found', errors : {}})
    }
  })

};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  // console.log(req.user)
  // res.send({status : 200});
  // return;
  try {
    Site.find({_id:{$in:req.user.sites}})
    .populate([
      {
        path : 'companyId',
        model : 'Company'
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
    
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  Site.deleteOne({_id : req.params.locId})
  .then((data) => {
    res.json(201,{code: 201, message: 'Site deleted successfully.', data: {}});
  })
  .catch((error) => {
    res.json(500 ,{code: 500, message: 'Internal server error.', errors: error});
  })
};
