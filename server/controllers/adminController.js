const { TryCatch } = require("../middlewares/error");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const { ErrorHandler } = require("../utils/utility");
const { cookieOptions } = require("../utils/features");
const jwt = require("jsonwebtoken");


exports.adminLogin = TryCatch(async (req, res, next) => {

    const { secretKey } = req.body;

    const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'karandeveloper'

    const isMatched = secretKey === adminSecretKey;

    if (!isMatched) return next(new ErrorHandler('Invalid Secret Key', 401))

    const token = jwt.sign(secretKey, process.env.JWT_SECRET)

    return res.status(200).cookie('admin-token', token, { ...cookieOptions, maxAge: 1000 * 60 * 15 }).json({
        success: true,
        message: 'Welcome BOSS'
    })

})

exports.adminLogout = TryCatch(async (req, res) => {

    res.clearCookie("admin-token")

    // return res.status(200).cookie('admin-token', '', { ...cookieOptions, maxAge: 0 }).json({
    //     success: true,
    //     message: 'You are logged out now BOSS'
    // })
    return res.status(200).json({
        success: true,
        message: 'You are logged out now BOSS'
    })
})

exports.verifyAdmin = TryCatch(async (req, res) => {
    return res.status(200).json({
        admin: true
    })
})

exports.getAllUsers = TryCatch(async (req, res) => {

    const users = await User.find({});

    const transformUsers = await Promise.all(
        users.map(async ({ name, username, avatar, _id }) => {

            const [groups, friends] = await Promise.all([
                Chat.countDocuments({ groupChat: true, members: _id }),
                Chat.countDocuments({ groupChat: false, members: _id })
            ])

            return {
                name,
                username,
                avatar: avatar.url,
                _id,
                groups,
                friends
            }
        })
    )

    return res.status(200).json({
        status: 'success',
        users: transformUsers
    })
})

exports.getAllChats = TryCatch(async (req, res) => {

    const chats = await Chat.find({}).populate('members', 'name avatar').populate('creator', 'name avatar')

    const transformChats = await Promise.all(
        chats.map(async ({ members, _id, groupChat, name, creator }) => {

            const totalMessage = await Message.countDocuments({ chat: _id })

            return {
                _id,
                groupChat,
                name,
                avatar: members.slice(0, 3).map((member) => member.avatar.url),
                members: members.map(({ _id, name, avatar }) => ({
                    _id,
                    name,
                    avatar: avatar.url
                })),
                creator: {
                    name: creator?.name || 'None',
                    avatar: creator?.avatar.url || 'None'
                },
                totalMembers: members.length,
                totalMessage,

            }
        })
    )

    return res.status(200).json({
        status: 'success',
        chats: transformChats
    })

})


exports.getAllMessages = TryCatch(async (req, res) => {

    const messages = await Message.find({}).populate('sender', 'name avatar').populate('chat', 'groupChat')

    const transformMessages = messages.map(({ content, attachment, _id, sender, createdAt, chat }) => ({
        _id,
        attachment,
        content,
        createdAt,
        chat: chat._id,
        groupChat: chat.groupChat,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url
        }
    }))

    return res.status(200).json({
        success: true,
        messages:transformMessages
    })

})

exports.getDashboard = TryCatch(async (req, res) => {
    const [groupsCount, usersCount, messageCount, totalChatsCounts] = await Promise.all([
        Chat.countDocuments({ groupChat: true }),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
    ])

    
    const today = new Date();
    
    let last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7)

    const last7DaysMessages = await Message.find({
        createdAt: {
            $gte: last7Days,
            $lte: today
        },
    }).select('createdAt')

    const messages = new Array(7).fill(0);

    const daysInMiliSec = (1000 * 60 * 60 * 24);

    last7DaysMessages.forEach((msg) => {
        const indexApprox = (today.getTime() - msg.createdAt.getTime()) / daysInMiliSec

        const index = Math.floor(indexApprox);
        
        messages[6 - index]++;
        })
        
        const stats = {
            groupsCount, usersCount, messageCount, totalChatsCounts,  messagesCharts: messages
        }
        
        
        return res.status(200).json({
            success: true,
            stats,
    })
})