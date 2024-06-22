const express = require('express');
const { isAuthenticated } = require('../middlewares/isAuth');
const { newGroupChat, getMyChats, getMyGroups, addMembers, removeMembers, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages } = require('../controllers/chatController');
const { attachmentsMulter } = require('../middlewares/multer');
const { newGroupValidator, validateHandler, addMembersValidator, removeMembersValidator, leaveGroupValidator, sendAttachmentsValidator, getMessagesValidator, chatIdValidator, renameGroupValidator } = require('../lib/validators');


const app = express.Router();

app.use(isAuthenticated)

app.post('/new', newGroupValidator(), validateHandler, newGroupChat)

app.get('/my', getMyChats)

app.get('/my/groups', getMyGroups)

app.put('/addmembers', addMembersValidator(), validateHandler, addMembers)

app.put('/removemember', removeMembersValidator(), validateHandler, removeMembers)

app.delete('/leave/:id', chatIdValidator(), validateHandler, leaveGroup)

//Send attachments
app.post('/message', attachmentsMulter, sendAttachmentsValidator(), validateHandler, sendAttachments)

//get messages
app.get('/message/:id', chatIdValidator(), validateHandler, getMessages)

//Get Chat Details, Remoname , Delete
app.route('/:id')
    .get(chatIdValidator(), validateHandler, getChatDetails)
    .put( renameGroupValidator(),  validateHandler, renameGroup)
    .delete( chatIdValidator(),  validateHandler,deleteChat)

module.exports = app