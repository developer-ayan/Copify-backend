const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = require('../utils/static-values');

// Set up AWS credentials using AWS SDK v3
const s3 = new S3Client({
    region: 'eu-north-1',  // Replace with your S3 bucket's region
    endpoint: 'https://s3.eu-north-1.amazonaws.com', // Replace with the correct endpoint
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,   // Replace with your access key
        secretAccessKey: AWS_SECRET_ACCESS_KEY, // Replace with your secret key
    },
});

// Set storage engine using multer-s3 and AWS SDK v3 for multiple files
const storage_upload = multerS3({
    s3: s3,
    bucket: 'copify-public', // Replace with your S3 bucket name
    acl: 'public-read', // Adjust ACL (Access Control List) as needed
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        cb(null, `uploads/${Date.now()}_${path.basename(file.originalname)}`); // Save with unique name in S3
    }
});

// Export the multer instance for multiple file uploads
const multipleFileUpload = multer({ storage: storage_upload }).array('file_uploads', 10); // 10 is the limit of files you want to upload at once


module.exports = multipleFileUpload;