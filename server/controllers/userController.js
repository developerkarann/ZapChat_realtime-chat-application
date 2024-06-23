const User = require('../models/userModel');
const { sendToken, emitEvent, uploadFilesToCloudinary } = require('../utils/features');
const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../utils/utility');
const { TryCatch } = require('../middlewares/error');
const Chat = require('../models/chatModel');
const Request = require('../models/requestModel');
const { NEW_REQUEST, REFETCH_CHATS } = require('../constants/events');
const { getOtherMembers } = require('../lib/helperFunc');

// Create a new user and save it into database and save token in cookie
exports.newUser = TryCatch(async (req, res, next) => {
    const { name, username, password, bio } = req.body;

    const file = req.file;


    if (!file) return next(new ErrorHandler('Please Upload Avatar', 400))

    const result = await uploadFilesToCloudinary([file])

    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    }

    const user = await User.create({
        name,
        username,
        password,
        bio,
        avatar,
    })

    sendToken(res, user, 201, 'Account Created')
})

//Login user and save token in cookie
exports.login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;

    // console.log(username, password)

    const user = await User.findOne({ username: username }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Username', 404))
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return next(new ErrorHandler('Invalid Password', 404))
    }

    sendToken(res, user, 200, `Welcome ${user.name}`)
})

exports.getMyProfile = TryCatch(async (req, res) => {

    const user = await User.findById(req.user)

    res.status(200).json({
        success: true,
        data: user
    })
})

exports.logout = TryCatch(async (req, res) => {

    const cookieOptions = {
        maxAge: 0,
        sameSite: 'none',
        // httpOnly: true,
        secure: true,
        expires: new Date(Date.now()),
    }
  
     res.cookie('token', null, cookieOptions )

    // res.clearCookie("token")
   
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        time: Date.now()
    })
})

exports.searchUser = TryCatch(async (req, res) => {

    const { name = '' } = req.query;
    //Finding All My Chats


    const myChats = await Chat.find({ groupChat: false, members: req.user });

    //  All Users with whom i am connected means friends and people i have chatted wuth
    const allUserFromMyChats = myChats.map((chat) => chat.members).flat()

    //All Users other than me and my friends
    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUserFromMyChats },
        name: { $regex: name, $options: 'i' }
    });

    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url
    }))



    return res.status(200).json({
        success: true,
        message: name,
        users
    })
})

exports.sendFriendRequest = TryCatch(async (req, res, next) => {
    const { userId } = req.body;

    const request = await Request.findOne({
        $or: [
            { sender: req.user, receiver: userId },
            { sender: userId, receiver: req.user },
        ],
    })

    if (request) return next(new ErrorHandler('Request already sent', 400))

    await Request.create({
        sender: req.user,
        receiver: userId
    })

    emitEvent(req, NEW_REQUEST, [userId])

    return res.status(200).json({
        success: true,
        message: 'Frined Request Sent'
    })

})

exports.acceptFriendRequest = TryCatch(async (req, res, next) => {

    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId).populate('sender', 'name').populate('receiver', 'name')

    // console.log(request)

    if (!request) return next(new ErrorHandler('Request not found', 404))

    if (request.receiver._id.toString() !== req.user.toString()) {
        return next(new ErrorHandler('You are not authorized to accept this request', 401))
    }
    if (!accept) {
        await request.deleteOne();
        return res.status(200).json({
            success: true,
            message: 'Friend Request Rejected'
        })
    }

    const members = [request.sender._id, request.receiver._id]

    await Promise.all([
        Chat.create({ members, name: `${request.sender.name} - ${request.receiver.name}` }),
        request.deleteOne()
    ])

    emitEvent(req, REFETCH_CHATS, members)

    return res.status(200).json({
        success: true,
        message: 'Friend Request Accpeted',
        senderId: request.sender._id
    })

})

exports.getAllNotifications = TryCatch(async (req, res, next) => {

    const requests = await Request.find({ receiver: req.user }).populate('sender', 'name avatar ')

    const allRequests = requests.map(({ _id, sender }) => ({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar
        }
    }))

    return res.status(200).json({
        success: true,
        allRequests
    })

})
exports.getMyFriends = TryCatch(async (req, res, next) => {

    const chatId = req.query.chatId;

    const chats = await Chat.find({ members: req.user, groupChat: false }).populate('members', 'name avatar');

    const friends = chats.map(({ members }) => {
        const otherUser = getOtherMembers(members, req.user)
        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar.url
        }
    })
    if (chatId) {
        const chat = await Chat.findById(chatId);
        const availableFriends = friends.filter(
            (frnd) => !chat.members.includes(frnd._id)
        )
        return res.status(200).json({
            success: true,
            availableFriends
        })
    } else {
        return res.status(200).json({
            success: true,
            friends
        })
    }


    return res.status(200).json({
        success: true,
        allRequests
    })

})
