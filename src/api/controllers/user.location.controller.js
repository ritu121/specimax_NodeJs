const httpStatus = require('http-status');
const { omit } = require('lodash');
const multer = require('multer');
const Site = require('../models/user.location');
const path = require('path');
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
// exports.get = (req, res) => {
//   const { site } = req.locals;
//   const {documentId} = req.body
//   const userId = req.user._id
//   Site.findOne({ siteInduction: documentId}, function(err, site){
//      if(err){
//       return res.status(500).send({ code: 500, message: 'internal server error', errors: err });
//      }
//      if(site){
//       return res.send(200, { code: 200, message: 'Site specific induction retrieved successfully.', data: site });
//      }
//      let doc = new Site({siteInduction:documentId,userId})
//      let data = await doc.save()
//      return res.send(200, { code: 200, message: 'Site specific induction retrieved successfully.', data: data });
//   })
  

// };

exports.get = (req, res) => res.json({code: 200, message: 'Doument status retrieved successfully.', data: req.locals.site.transform()});

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.site.transform());

/**
 * Create new user
 * @public
 */

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, '../../uploads/');
//   },

//   // By default, multer removes file extensions so let's add them back
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });



/**
 * Replace existing user
 * @public
 */


/**
 * Update existing user
 * @public
 */
exports.update = async (req, res, next) => {
    try {
        let update = await Site.updateOne({user:req.user._id},{$set:{lat:req.body.lat,lng:req.body.lng}},{upsert:true});
        return res.json({code:200, message:"Location Updated Successfully!!"})
    } catch (error) {
        next(error)
    }
  
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    // const { site } = req.locals;
    // const {document} = req.query
    const userId = req.user._id
    let locs = await Site.list(req.query)
    return res.send(200, { code: 200, message: 'Location retrieved successfully.', data: locs });
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
    .then(() => res.send(200, { code: 200, message: 'License delete successfully.'}))
    .catch((e) => next(e));
};
