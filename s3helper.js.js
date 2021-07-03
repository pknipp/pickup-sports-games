const fs = require('fs');
const AWS = require('aws-sdk');
// const { S3 } = require('aws-sdk');
const { awsConfig: { accessKeyId, secretAccessKEY, region } } = require('./config/index')

const S3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKEY,
    region: region
})

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
