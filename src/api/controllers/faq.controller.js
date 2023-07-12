const httpStatus = require('http-status');
const { omit } = require('lodash');
const Faq = require('../models/faq.model');
const Privacy = require('../models/privacy.model');
const Tnc = require('../models/tnc.model');
const multer = require('multer');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const faq = await Faq.get(id);
    req.locals = { faq };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'Faq info retrieved successfully.', data: req.locals.faq.transform()});

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.faq.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const faq = new Faq(req.body);
    const savedFaq = await faq.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Faq created successfully.', data: savedFaq.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { faq } = req.locals;
    const newFaq = new Faq(req.body);
    const newFaqObject = omit(newFaq.toObject(), '_id');

    await faq.updateOne(newFaqObject, { override: true, upsert: true });
    const savedFaq = await faq.findById(faq._id);

    res.json({code: 200, message: 'Faq updated successfully.', data: savedFaq.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedFaq = omit(req.body);
  const faq = Object.assign(req.locals.faq, updatedFaq);

  faq.save()
    .then((faq) => res.json({code : 200, message : 'Faq updated successfully.', data: faq.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const faqs = await Faq.list(req.query);
    const transformedFaqs = faqs.map((faq) => faq.transform());
    res.json({code : 200, message : 'Faq list retrieved successfully.', data: transformedFaqs});
  } catch (error) {
    next(error);
  }
};

exports.privacy = async (req, res, next) => {
  try {
    const faqs = await Privacy.list(req.query);
    // const transformedFaqs = faqs.map((faq) => faq.transform());
    res.json({code : 200, message : 'Privacy Policy retrieved successfully.', data: faqs[0].transform()});
  } catch (error) {
    next(error);
  }
};
exports.createPrivacy = async (req, res, next) => {
  try {
    req.body.user=req.user._id
    const faq = new Privacy(req.body);
    const savedFaq = await faq.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Policy created successfully.', data: savedFaq.transform()});
  } catch (error) {
    next(error);
  }
};
exports.tnc = async (req, res, next) => {
  try {
    const faqs = await Tnc.list(req.query);
    // const transformedFaqs = faqs.map((faq) => faq.transform());
    res.json({code : 200, message : 'TNCs retrieved successfully.', data: faqs[0].transform()});
  } catch (error) {
    next(error);
  }
};
exports.createTerms = async (req, res, next) => {
  try {
    req.body.user=req.user._id
    const faq = new Tnc(req.body);
    const savedFaq = await faq.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Terms created successfully.', data: savedFaq.transform()});
  } catch (error) {
    next(error);
  }
};
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
exports.updatePrivacy = async (req, res, next) => {
  let priv = await Privacy.findOne({_id:req.params.privacyId})
  const title = req.body.title
  const upload = multer({ storage }).single('picture');
    upload(req, res, (err) => {
      if (req.fileValidationError) {
        return res.send(400, { code: 400, message: 'Invalid file type', errors: req.fileValidationError });
      }
      if (!req.files) {
        return res.send(400, { code: 400, message: 'Please select an image to upload' });
      }
      if (err instanceof multer.MulterError) {
        return res.status(500).send({ code: 500, message: `Could not upload the file: ${req.file.originalname}. ${err}` });
      }
      
      const baseUrl = `${req.protocol}://${req.headers.host}`;
      // const updatedFaq = omit(req.body);
      // let privacy = Object.assign(priv, updatedFaq);
      if(title){
        priv.title = title
      }
      priv.media=`${baseUrl}/uploads/${req.files.picture[0].filename}`
      priv.save()
    .then((data) => res.send({ code: 200, message: 'Privacy Policy updated successfully.', data: data.transform() }))
    .catch((e) => next(e));
    });
 
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { faq } = req.locals;
  faq.remove()
    .then(() => res.json({code : 200, message : 'Faq deleted successfully.', data: null}))
    .catch((e) => next(e));
};
