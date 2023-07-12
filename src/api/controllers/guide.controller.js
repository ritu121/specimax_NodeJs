const httpStatus = require('http-status');
const { omit } = require('lodash');
const Guide = require('../models/user.guide.model');
const multer = require('multer');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const faq = await Guide.get(id);
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
exports.get = (req, res) => res.json({ code: 200, message: 'Guide retrieved successfully.', data: req.locals.faq.transform() });

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
        req.body.user = req.user._id
        const faq = new Guide(req.body);
        const savedFaq = await faq.save();
        const upload = multer({ storage }).single({ name: "picture" });
       
        upload(req, res, (err) => {
            if (req.files) {
                if (req.fileValidationError) {
                    return res.send(400, { code: 400, message: 'Invalid file type', errors: req.fileValidationError });
                }
                if (!req.files) {
                    return res.send(400, { code: 400, message: 'Please select an image to upload' });
                }
                if (err instanceof multer.MulterError) {
                    return res.status(500).send({ code: 500, message: `Could not upload the file: ${req.files.originalname}. ${err}` });
                }
                else {

                    const baseUrl = `${req.protocol}://${req.headers.host}`;
                    const updateData = {
                        media: `${baseUrl}/uploads/${req.files.picture[0].filename}`,
                        mediaType: `${req.files.picture[0].mimetype}`
                    };
                    Guide.updateOne({ _id: savedFaq._id }, updateData, (err, update) => {
                        if (err) res.json(500, { code: 200, message: 'Internal server error' })
                        if (update) {
                            Guide.findOne({ _id: savedFaq._id })
                                .then((one) => {
                                    res.status(httpStatus.CREATED);
                                    res.json({ code: 201, message: 'Guide created successfully.', data: one });
                                })
                                .catch((errors) => {
                                    res.send(500, { code: 500, message: 'INternet server error.', errors: errors });
                                })

                        }
                        else {
                            res.send(500, { code: 500, message: 'INternet server error.' });
                        }
                    })
                }
            }
            else {
                res.json({ code: 201, message: 'Guide created successfully.', data: savedFaq });
            }
        })
        // res.status(httpStatus.CREATED);
        // res.json({code: 201, message: 'Guide created successfully.', data: savedFaq.transform()});
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
        const newFaq = new Guide(req.body);
        const newFaqObject = omit(newFaq.toObject(), '_id');

        await faq.updateOne(newFaqObject, { override: true, upsert: true });
        const savedFaq = await faq.findById(faq._id);

        res.json({ code: 200, message: 'Guide updated successfully.', data: savedFaq.transform() });
    } catch (error) {
        next(error);
    }
};

/**
 * Update existing user
 * @public
 */
exports.update = async(req, res, next) => {
    const updatedFaq = omit(req.body);
    const faq = Object.assign(req.locals.faq, updatedFaq);

    const savedFaq = await faq.save()
    const upload = multer({ storage }).single({ name: "picture" });

    upload(req, res, (err) => {
        if (req.files) {
            if (req.fileValidationError) {
                return res.send(400, { code: 400, message: 'Invalid file type', errors: req.fileValidationError });
            }
            if (!req.files) {
                return res.send(400, { code: 400, message: 'Please select an image to upload' });
            }
            if (err instanceof multer.MulterError) {
                return res.status(500).send({ code: 500, message: `Could not upload the file: ${req.files.originalname}. ${err}` });
            }
            else {

                const baseUrl = `${req.protocol}://${req.headers.host}`;
                const updateData = {
                    media: `${baseUrl}/uploads/${req.files.picture[0].filename}`,
                    mediaType: `${req.files.picture[0].mimetype}`
                };
                Guide.updateOne({ _id: savedFaq._id }, updateData, (err, update) => {
                    if (err) res.json(500, { code: 200, message: 'Internal server error' })
                    if (update) {
                        Guide.findOne({ _id: savedFaq._id })
                            .then((one) => {
                                res.status(httpStatus.CREATED);
                                res.json({ code: 200, message: 'Guide Updated successfully.', data: one });
                            })
                            .catch((errors) => {
                                res.send(500, { code: 500, message: 'INternet server error.', errors: errors });
                            })

                    }
                    else {
                        res.send(500, { code: 500, message: 'INternet server error.' });
                    }
                })
            }
        }
        else {
            res.json({ code: 201, message: 'Guide Updated successfully.', data: savedFaq });
        }
    })
        // .then((faq) => res.json({ code: 200, message: 'Guide updated successfully.', data: faq.transform() }))
        // .catch((e) => next(e));
};
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const faqs = await Guide.list(req.query);
        const transformedFaqs = faqs.map((faq) => faq.transform());
        res.json({ code: 200, message: 'Guide list retrieved successfully.', data: transformedFaqs });
    } catch (error) {
        next(error);
    }
};


exports.remove = (req, res, next) => {
    const { faq } = req.locals;
    faq.remove()
        .then(() => res.json({ code: 200, message: 'Guide deleted successfully.', data: null }))
        .catch((e) => next(e));
};
