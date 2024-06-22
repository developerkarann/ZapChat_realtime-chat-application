const express = require('express');
const { login, newUser, getMyProfile, logout, searchUser, sendFriendRequest, acceptFriendRequest, getAllNotifications, getMyFriends } = require('../controllers/userController');
const { singleAvatar } = require('../middlewares/multer');
const { isAuthenticated } = require('../middlewares/isAuth');
const {registerValidator, validateHandler, loginValidator, sendFriendRequestValidator, acceptRequestValidator} = require('../lib/validators');


const app = express.Router();

app.post('/new', singleAvatar, registerValidator(), validateHandler, newUser)
app.post('/login', loginValidator(), validateHandler, login)

// After Here User must be logged in to access the routes
app.use(isAuthenticated)

app.get('/me', getMyProfile)

app.get('/logout', logout)

app.get('/search', searchUser)

app.put('/sendrequest', sendFriendRequestValidator(), validateHandler, sendFriendRequest)

app.put('/accept-request', acceptRequestValidator(), validateHandler, acceptFriendRequest)

app.get('/notifications', getAllNotifications)

app.get('/friends', getMyFriends)


module.exports = app