const httpStatus = require('http-status');
const { omit } = require('lodash');
const multer = require('multer');
const License = require('../../models/user.license.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const license = await License.get(id);
    req.locals = { license };
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
  const { license } = req.locals;
  License.findOne({ _id: license }, function (err, licensee) {
    if (err) {
      return res.status(500).send({ code: 500, message: 'internal server error', errors: err });
    }
    if (license) {
      return res.send(200, { code: 200, message: 'License  retrieved successfully.', data: licensee });
    }
    return res.send(500, { code: 500, message: 'License not found.', errors });
  })


};
exports.download = (req, res) => {
  const { license } = req.locals;
  const baseUrl = `http://50.17.107.208:3004`;
  const path = `${baseUrl}/timesheets/630cfedd96e1d4473a4d2b72.pdf`;

  res.json({ path })


};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.license.transform());

/**
 * Create new user
 * @public
 */

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

exports.create = async (req, res, next) => {
  try {
    const data = req.body;
    const user_id = req.user._id;
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
      const license = new License({
        user: user_id,
        licenseName: data.licenseName,
        licenseNumber: data.licenseNumber,
        issuingAuthority: data.issuingAuthority,
        issuingState: data.issuingState,
        country: data.country,
        expiryDate: data.expiryDate,
        picture: `${baseUrl}/uploads/${req.files.picture[0].filename}`,
      });

      license.save((err) => {
        if (err) { return res.status(500).send({ code: 500, message: 'internal server error', errors: err }); }

        const licenceData = {
          _id: license._id,
          licenseName: license.licenseName,
          licenseNumber: license.licenseNumber,
          issuingAuthority: license.issuingAuthority,
          issuingState: license.issuingState,
          country: license.country,
          expiryDate: license.expiryDate,
          picture: license.picture,
        };
        res.status(httpStatus.CREATED);
        res.send(201, { code: 201, message: 'License created successfully.', data: licenceData });
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.createByUserid = async (req, res, next) => {
  try {
    const data = req.body;
    const user_id = req.query.user;
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
      const license = new License({
        user: user_id,
        licenseName: data.licenseName,
        licenseNumber: data.licenseNumber,
        issuingAuthority: data.issuingAuthority,
        issuingState: data.issuingState,
        country: data.country,
        expiryDate: data.expiryDate,
        picture: `${baseUrl}/uploads/${req.files.picture[0].filename}`,
      });
      license.save((err) => {
        if (err) { return res.status(500).send({ code: 500, message: 'internal server error', errors: err }); }

        const licenceData = {
          _id: license._id,
          licenseName: license.licenseName,
          licenseNumber: license.licenseNumber,
          issuingAuthority: license.issuingAuthority,
          issuingState: license.issuingState,
          country: license.country,
          expiryDate: license.expiryDate,
          picture: license.picture,
        };
        res.status(httpStatus.CREATED);
        res.send(201, { code: 201, message: 'License created successfully.', data: licenceData });
      });
    });
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
    const { license } = req.locals;
    const newLicense = new License(req.body);
    const newLicenseObject = omit(newLicense.toObject(), '_id');

    await license.updateOne(newLicenseObject, { override: true, upsert: true });
    const savedLicense = await license.findById(license._id);

    res.send({ code: 200, message: 'License updated successfully.', data: savedLicense.transform() });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
// exports.update = (req, res, next) => {
//   const updatedLicense = omit(req.body);
//   const license = Object.assign(req.locals.license, updatedLicense);

//   license.save()
//     .then((data) => res.send({ code: 200, message: 'License updated successfully.', data: data.transform() }))
//     .catch((e) => next(e));
// };
exports.update = (req, res, next) => {
  const updatedLicense = omit(req.body);
  const license = Object.assign(req.locals.license, updatedLicense);
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
      
      const license = Object.assign(req.locals.license, updatedLicense);
      if(license.picture==""){
        delete license.picture
      }
      if(req.files?.picture?.[0].filename && req.files?.picture?.[0].filename!=""){
        license.picture=`${baseUrl}/uploads/${req.files.picture?.[0].filename}`
      }
      license.save()
    .then((data) => res.send({ code: 200, message: 'License updated successfully.', data: data.transform() }))
    .catch((e) => next(e));
    });
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    // req.query.user=req.user._id
    // console.log('aaa=======>>>>>>>',req.query)
    const licenses = await License.list(req.query);
    const transformedLicenses = licenses.map((status) => status.transform());
    res.send({ code: 200, message: 'License list retrieved successfully.', data: transformedLicenses });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { license } = req.locals;

  license.remove()
    .then(() => res.send(200, { code: 200, message: 'License delete successfully.' }))
    .catch((e) => next(e));
};
