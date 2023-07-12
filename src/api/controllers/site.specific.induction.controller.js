const httpStatus = require('http-status');
const { omit } = require('lodash');
const multer = require('multer');
const exceljs = require('exceljs')

const Site = require('../models/site.specific.induction.model');
const path = require('path');
/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const site = await Site.get(id);
    console.log('in site',site)
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
  const { site } = req.locals;
  console.log('site',site)
  return res.send(200, { code: 200, message: 'Site specific induction retrieved successfully.', data: site });
  Site.findOne({ _id: site, visibility : true }, function(err, site){
     if(err){
      return res.status(500).send({ code: 500, message: 'internal server error', errors: err });
     }
     if(site){
      return res.send(200, { code: 200, message: 'Site specific induction retrieved successfully.', data: site });
     }
     return res.send(500, { code: 500, message: 'License not found.', errors });
  })
  
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

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../../uploads/');
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
      console.log('file = ==>',req.files.picture[0])
      const site = new Site({
        title: data.title,
        keyword: data.keyword,
        siteId: data.siteId,
        visibility:data.visibility,
        category: data.category,
        document: `${baseUrl}/uploads/${req.files?.picture[0]?.filename}`,
        mediaType: `${req.files?.picture[0]?.mimetype}`

      });

      site.save((err) => {
        if (err) { return res.status(500).send({ code: 500, message: 'internal server error', errors: err }); }

        const siteData = {
          _id: site._id,
          userId: site.userId,
          title: site.title,
          keyword: site.keyword,
          document: site.document,
          createdAt: site.createdAt,
        };
        res.status(httpStatus.CREATED);
        res.send(201, { code: 201, message: 'Site Document created successfully.', data: siteData });
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
    const { site } = req.locals;
    const newSite = new Site(req.body);
    const newSiteObject = omit(newSite.toObject(), '_id');

    await site.updateOne(newSiteObject, { override: true, upsert: true });
    const savedSite = await site.findById(license._id);

    res.send({ code: 200, message: 'Site specific induction updated successfully.', data: savedSite.transform() });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  try {
    const data = req.body;
    const query = {_id : req.params.siteId}
    const user_id = req.user._id;
    const upload = multer({ storage }).single('picture');
    upload(req, res, (err) => {
      if (req.fileValidationError) {
        return res.send(400, { code: 400, message: 'Invalid file type', errors: req.fileValidationError });
      }
      if (!req.file) {
        return res.send(400, { code: 400, message: 'Please select an image to upload' });
      }
      if (err instanceof multer.MulterError) {
        return res.status(500).send({ code: 500, message: `Could not upload the file: ${req.file.originalname}. ${err}` });
      }

      const baseUrl = `${req.protocol}://${req.headers.host}`;

      const updatedData = {
        title: data.title,
        keyword: data.keyword,
        category: data.category,
        visibility:data.visibility,
        document: `${baseUrl}/uploads/${req.file.filename}`,
      }

      Site.updateOne(query, updatedData, function(err, data) {
        if (err) { return res.status(500).send({ code: 500, message: 'internal server error', errors: err }); }
        Site.findOne(query, function(errors, mysite){
          if(errors){
            return res.status(500).send({ code: 500, message: 'internal server error', errors: err });
          }
          res.send(201, { code: 201, message: 'Site Specific induction updated successfully.', data: mysite });
        })
      });
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const sites = await Site.list(req.query);
    const transformedSites = sites.map((status) => status.transform());
    res.send({ code: 200, message: 'Site specific induction list retrieved successfully.', data: transformedSites });
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
    .then(() => res.send(200, { code: 200, message: 'Site specific induction delete successfully.'}))
    .catch((e) => next(e));
};

exports.exportDocument = async (req, res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    const { site } = req.params;
    const sites = await Site.find({siteId: site});
    const transformedSites = sites.map((status) => status.transform());
    worksheet.columns = [
      { header: 'Site Id', key: 'siteId', width: 25 },
      { header: 'Title', key: 'title', width: 25 },
      { header: 'Keyword', key: 'keyword', width: 25 },
      { header: 'Document', key: 'document', width: 25 },
      { header: 'Category', key: 'category', width: 25 },
      { header: 'Visibility', key: 'visibility', width: 25 },
    ];
    transformedSites.forEach((data) => worksheet.addRow(data));
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=siteDocument.xlsx`
    );
    return workbook.xlsx.write(res).then(() => res.status(200));

    // res.send({ code: 200, message: 'Site specific induction list retrieved successfully.', data: transformedSites });
  } catch (error) {
    next(error);
}
}