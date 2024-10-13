const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const fileName = "image";
const updateBaseUrl = 'http://localhost:8085';
const imgPath = "/file/";

const resolve = (dir) => {
    return path.join(__dirname, './', dir)
}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, resolve('../file'))
        } else {
            cb({ error: 'Mime type not supported' })
        }
    },
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        cb(null, md5(+new Date()) + "." + fileFormat[fileFormat.length - 1]);
    },
    encoding: 'utf-8'
})

const multerConfig = multer({
    storage: storage,
})

function upload(req, res) {
    return new Promise((resolve, reject) => {
        multerConfig.single(fileName)(req, res, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(updateBaseUrl + imgPath + req.file.filename)
            }
        });
    })
}

module.exports = upload;
