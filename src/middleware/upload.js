const multer = require('multer');
const path = require('path');

const createStorage = (customPath) =>
    multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '..', 'public', 'img', customPath));
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });

const maxSize = 100 * 1000 * 1000;

const createUpload = (folderName) =>
    multer({
        storage: createStorage(folderName),
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
                new Error(
                    'File upload only supports the following filetypes - jpeg, jpg, png',
                ),
            );
        },
    });

const uploadFile = (req, res, next, folderName) => {
    createUpload(folderName).single('image')(req, res, (err) => {
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

const uploadFileMiddleware = (folderName) => (req, res, next) => {
    uploadFile(req, res, next, folderName);
};

module.exports = uploadFileMiddleware;
