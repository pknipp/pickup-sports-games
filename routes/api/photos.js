const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const Sequelize = require('sequelize');
const router = require('express').Router();
const multer = require('multer');
const { create } = require("../../db/user-repository");
const { User, Game, Reservation } = require('../../db/models');
const { authenticated, generateToken } = require('./security-utils');
const { uploadFile } = require('../../s3helper.js');
const { v4: uuidv4 } = require('uuid');
const { S3 } = require('aws-sdk');

const BUCKET = 'volleyballbucket';

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({ storage }).single('image');

router.post('', upload, asyncHandler(async (req, res, next) => {

        let myImage = req.file.originalname.split(".");
        const fileType = myImage[myImage.length - 1];
        const params = {
            Bucket: BUCKET,
            Key: `${uuidv4()}.${fileType}`,
            Body: req.file.buffer,
        }
        let message = "";
        let response = { user: {} };
        console.log("top of else-block, where typeof(S3) = ", typeof(S3));
        console.log("top of else-block, where typeof(S3.uploadFile) = ", typeof(S3.uploadFile));
        S3.uploadFile(params, (error, data) => {
            console.log("before error block in S3.uploadFile invocation")
            if (error) {
                console.log("error = ", error);
                // req.status(500).send(error)
                res.status(500).send(error)
            }
        })
        console.log("after S3.uploadFile invocation");
        req.body.photo = params.Key;
        const user = await create(req.body);
        response.user = { ...response.user, ...user.toSafeObject() }
        response.user.message = message;
        res.json(response);
    }));

module.exports = router;
