const { body, validationResult, check, param, query } = require('express-validator');
const { ErrorHandler } = require('../utils/utility');
const validateHandler = (req, res, next) => {
    const errors = validationResult(req)

    const errorMessage = errors.array().map((err) => err.msg).join(',')

    // console.log(errorMessage)

    if (errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessage, 400))
}

const registerValidator = () => [
    body('name', 'Please enter your name').notEmpty(),
    body('username', 'Please enter your username').notEmpty(),
    body('password', 'Please enter your password').notEmpty(),
    body('bio', 'Please enter bio').notEmpty(),
];

const loginValidator = () => [
    body('username', 'Please enter your username').notEmpty(),
    body('password', 'Please enter your password').notEmpty(),
];

const newGroupValidator = () => [
    body('name', 'Please enter your name').notEmpty(),
    // body('members').notEmpty().withMessage('Please enter members').isArray({ min: 2, max: 10 }).withMessage('Members must be 2-10')
];

const addMembersValidator = () => [
    body('chatId', 'Please enter chatId').notEmpty(),
    body('members').notEmpty().withMessage('Please enter members').isArray({ min: 1, max: 7 }).withMessage('Members must be 1-7')
];

const removeMembersValidator = () => [
    body('chatId', 'Please enter ChatId').notEmpty(),
    body('chatId', 'Please enrter UserId').notEmpty(),
];

const sendAttachmentsValidator = () => [
    body('chatId', 'Please enter ChatId').notEmpty(),
    // check('avatar').notEmpty().withMessage('Please Upload Attachments').isArray({ min: 1, max: 5 }).withMessage('Attachments must be 2-10')
];
const chatIdValidator = () => [
    param('id', 'Please enter Chat Id').notEmpty(),
];

const renameGroupValidator = () => [
    param('id', 'Please enter Chat Id').notEmpty(),
    body('name', 'Please enter new name').notEmpty(),
];


const sendFriendRequestValidator = () => [
    body('userId', 'Please enter User Id').notEmpty(),
];
const acceptRequestValidator = () => [
    body('requestId', 'Please Enter Request ID').notEmpty(),
    body('accept').notEmpty().withMessage('Please Add Accept').isBoolean().withMessage('Accept Must Be Boolean'),
];

const adminLoginValidator = () => [
    body('secretKey', 'Please Enter Secret Key').notEmpty(),
];



module.exports = {
    registerValidator, validateHandler, loginValidator, newGroupValidator, addMembersValidator, removeMembersValidator
    , sendAttachmentsValidator, chatIdValidator, renameGroupValidator, sendFriendRequestValidator, acceptRequestValidator, adminLoginValidator
}