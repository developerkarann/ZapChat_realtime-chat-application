const multer = require("multer");

const multerUpload = multer({
    limits: {
        fileSize: 1024 * 1014 * 5,
    }
})

const singleAvatar = multerUpload.single('avatar');

const attachmentsMulter = multerUpload.array('files', 5);

module.exports = {singleAvatar, attachmentsMulter}