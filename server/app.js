const userSocketIds = new Map();
const onlineUsers = new Set();
const dotenv = require('dotenv').config()
const express = require('express')
const { connectDataBase } = require('./utils/features');
const { errorMiddleware, TryCatch } = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const { createMessageInChat } = require('./seeders/chat');
const cors = require('cors')
const { v4 } = require('uuid')
const cloudinary = require('cloudinary').v2
// Routes Imports
const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
// Web Sockets - Socket.io
const { Server } = require('socket.io')
const { createServer } = require('http');
const { NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING, CHAT_JOINED, CHAT_LEAVED, ONLINE_USERS } = require('./constants/events');
// const { getSockets } = require('./lib/helperFunc');
const Message = require('./models/messageModel');
const { corsOptions } = require('./constants/config');
const { socketAuthenticator } = require('./middlewares/isAuth');
const { getSockets } = require('./lib/helperFunc');


const databaseUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000

connectDataBase(databaseUri)

// Configuring cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


// createMessageInChat('660a84e09a26aabfab4b756f', 40)

// createSingleChat(1)
// createGroupChat(1)

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    }
})

app.use((req, res, next) => {
    req.userSocketIds = userSocketIds;
    req.io = io;
    next()
})



app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => {
    res.send('<h1>Hello World<h1/>')
});


//Web Sockets >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, async (err) => {
        await socketAuthenticator(err, socket, next)
    })
})

io.on('connection', (socket) => {

    // console.log('A user connected', socket.id)

    const user = socket.user;


    userSocketIds.set(user._id.toString(), socket.id)


    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {

        const messageForRealTime = {
            content: message,
            _id: v4(),
            sender: {
                _id: user._id,
                name: user.name
            },
            chat: chatId,
            createdAt: new Date()
        }

        const messageForDatabase = {
            content: message,
            sender: user._id,
            chat: chatId
        }

        const membersSockets = getSockets(members, userSocketIds)

        io.to(membersSockets).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime
        })
        io.to(membersSockets).emit(NEW_MESSAGE_ALERT, { chatId })

        try {
            await Message.create(messageForDatabase)
        } catch (error) {
            throw new Error(error)
        }
    })

    socket.on(START_TYPING, ({ members, chatId }) => {
        const membersSockets = getSockets(members, userSocketIds)

        socket.to(membersSockets).emit(START_TYPING, { chatId })
    })

    socket.on(STOP_TYPING, ({ members, chatId }) => {
        const membersSockets = getSockets(members, userSocketIds)

        socket.to(membersSockets).emit(STOP_TYPING, { chatId })
    })

    socket.on(CHAT_JOINED, ({ userId, members }) => {

        onlineUsers.add(userId.toString())

        const membersSockets = getSockets(members, userSocketIds)

        io.to(membersSockets).emit(ONLINE_USERS, Array.from(onlineUsers))
    })
    socket.on(CHAT_LEAVED, ({ userId, members }) => {

        onlineUsers.delete(userId.toString())

        const membersSockets = getSockets(members, userSocketIds)

        io.to(membersSockets).emit(ONLINE_USERS, Array.from(onlineUsers))

    })


    socket.on('disconnect', () => {
        // console.log('A User is disconnected', socket.id)
        userSocketIds.delete(user._id.toString())
        onlineUsers.delete(user._id.toString())
        socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers))
    })
})

//Middleware for error hadling
app.use(errorMiddleware);


server.listen(PORT, () => {
    console.log(`Server is running on port 3000`)
});

// exports.userSocketIds = userSocketIds

// module.exports = { userSocketIds, }