const express = require('express');
const { getAllUsers, getAllChats, getAllMessages, getDashboard, adminLogin, adminLogout, verifyAdmin } = require('../controllers/adminController');
const { adminLoginValidator, validateHandler } = require('../lib/validators');
const { isAdmin } = require('../middlewares/isAuth');



const app = express.Router();


app.post('/verify',adminLoginValidator(), validateHandler ,adminLogin)

app.get('/logout', adminLogout)

app.use(isAdmin)

app.get('/', verifyAdmin)

app.get('/users', getAllUsers)
app.get('/chats', getAllChats)
app.get('/messages', getAllMessages)

app.get('/stats', getDashboard)

module.exports = app