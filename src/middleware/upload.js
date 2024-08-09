const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'img', 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const maxSize = 1 * 1000 * 1000;

const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);

        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase(),
        );

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(
            'Error: File upload only supports the ' +
                'following filetypes - ' +
                filetypes,
        );
    },
});

const uploadFile = (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(400).send('Error uploading file. Please try again.');
        } else if (err) {
            console.log(err);
            res.status(500).send('Internal server error.');
        } else {
            next();
        }
    });
};

const uploadFileMiddleware = (req, res, next) => {
    uploadFile(req, res, next);
};

module.exports = uploadFileMiddleware;
