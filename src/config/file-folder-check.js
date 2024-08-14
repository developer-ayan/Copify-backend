const multer = require("multer");
const { existsSync, mkdirSync } = require("fs");
const path = require("path");

// Define the uploads directory
const uploads = path.join(__dirname, '../uploads/');

// Create the destination folder if it doesn't exist
if (!existsSync(uploads)) {
    mkdirSync(uploads, { recursive: true });
}

// const AWS = require('aws-sdk');
// const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = require("../utils/static-values");

// // Set up AWS credentials
// AWS.config.update({
//     accessKeyId: AWS_ACCESS_KEY_ID,       // Replace with your access key
//     secretAccessKey: AWS_SECRET_ACCESS_KEY, // Replace with your secret key
//     region: 'your-region'                           // Replace with your S3 region
// });

// const s3 = new AWS.S3();

// Set storage engine
const storage_upload = multer.diskStorage({
    destination: (req, file, cb) => {
        // Assuming you want to use the uploads directory
        cb(null, uploads);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Export the multer instance with the defined storage
const file_upload = multer({ storage: storage_upload }).single('file_upload');

module.exports = file_upload;
