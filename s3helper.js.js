const fs = require('fs');
const AWS = require('aws-sdk');
const { S3 } = require('aws-sdk');

module.exports.uploadFile = (file, contentType, serverPath, filename) => {
    if (!filename) {
        filename = serverPath.split('/').pop()
    }
    return S3.upload({
        Bucket: BUCKET,
        ACL: 'public-read',
        Key: serverPath,
        Body: file,
        ContentType: contentType,
        ContentDisposition: `attachment; filename=${filename}`,
    }).promise()
}