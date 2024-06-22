const { TryCatch } = require("../middlewares/error");
const { ErrorHandler } = require("../utils/utility");
const Chat = require('../models/chatModel');
const { emitEvent, deleteFilesFromCloudinary, uploadFilesToCloudinary } = require("../utils/features");
const { ALERT, REFETCH_CHATS, NEW_ATTACHMENT, NEW_MESSAGE_ALERT, NEW_MESSAGE } = require("../constants/events");
const { getOtherMembers } = require("../lib/helperFunc");
const User = require('../models/userModel');
const Message = require('../models/messageModel');


exports.newGroupChat = TryCatch(async (req, res, next) => {
    console.log('tiggerd')
    const { name, members } = req.body
    console.log('Group Name', name)
    console.log('Group members', members)
    if (members.length < 2) {
        return next(new ErrorHandler('Group chat must have atleast 3 members', 400))
    }
    const allMembers = [...members, req.user];
    await Chat.create({
        name,
        groupChat: true,
        creator: req.user,
        members: allMembers
    })
    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHATS, members);
    return res.status(201).json({
        success: true,
        message: 'Group Created'
    })

})


exports.getMyChats = TryCatch(async (req, res, next) => {

    const chats = await Chat.find({ members: req.user }).populate("members", "name avatar");

    const transformChats = chats.map(({ _id, name, members, groupChat }) => {

        const otherMember = getOtherMembers(members, req.user)

        return {
            _id,
            groupChat,
            avatar: groupChat ? members.slice(0, 3).map(({ avatar }) => avatar.url) : [otherMember.avatar.url],
            name: groupChat ? name : otherMember.name,
            members: members.reduce((prev, curr) => {
                if (curr._id.toString() !== req.user.toString()) {
                    prev.push(curr._id)
                }
                return prev
            }, [])
        }
    })

    return res.status(200).json({
        success: true,
        chats: transformChats
    })

})

exports.getMyGroups = TryCatch(async (req, res, next) => {
    const chats = await Chat.find({
        members: req.user,
        groupChat: true,
        creator: req.user,
    }).populate('members', "name avatar")

    const groups = chats.map(({ members, _id, groupchat, name }) => ({
        _id,
        groupchat,
        name,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url)
    }));

    return res.status(200).json({
        success: true,
        groups
    })
});


exports.addMembers = TryCatch(async (req, res, next) => {

    const { members, chatId, } = req.body

    console.log(members, chatId)

    const chat = await Chat.findById(chatId)

    if (!chat) return next(new ErrorHandler('Chat not found', 404))

    if (!chat.groupChat) return next(new ErrorHandler('This is not a group chat', 404))

    if (chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler('You are not allowed to add members', 403))
    }

    const allNewMembersPromise = members.map((i) => User.findById(i, 'name'))

    const allNewMembers = await Promise.all(allNewMembersPromise)

    // Skipping already added member and adding new member 
    // You can show an error here that user is already exsits
    const uniqueMembers = allNewMembers.filter((i) =>
        !chat.members.includes(i._id.toString())
    ).map((i) => i._id)

    chat.members.push(...uniqueMembers)

    if (chat.members.length > 10) {
        return next(new ErrorHandler('Group members limit reached', 400))
    }

    await chat.save()

    const allUsersname = allNewMembers.map((i) => i.name).join(",")

    emitEvent(req, ALERT, chat.members, `${allUsersname} has been addedd in the group`)

    emitEvent(req, REFETCH_CHATS, chat.members)

    return res.status(200).json({
        success: true,
        message: 'Message addedd successfully!'
    })

});

exports.removeMembers = TryCatch(async (req, res, next) => {

    console.log('Remove Member Function Triggered')

    const { userId, chatId } = req.body;

    const [chat, userThatWillBeRemoved] = await Promise.all([
        Chat.findById(chatId),
        User.findById(userId, 'name')
    ]);

    // if (!userThatWillBeRemoved) return next(new ErrorHandler('Member not found', 404))


    if (!chat) return next(new ErrorHandler('Chat not found', 404))

    if (!chat.groupChat) return next(new ErrorHandler('This is not a group chat', 404))

    if (chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler('You are not allowed to add members', 403))
    }

    if (chat.members.length <= 3) {
        return next(new ErrorHandler('Group must have at least 3 members', 400))
    }

    const allChatMembers = chat.members.map((i) => i.toString())

    chat.members = chat.members.filter(
        (member) => member.toString() !== userId.toString()
    );

    await chat.save()

    emitEvent(req, ALERT, chat.members,{
        message: `${userThatWillBeRemoved.name} has been removed from the group`,
        chatId
     })

    emitEvent(req, REFETCH_CHATS, allChatMembers)

    return res.status(200).json({
        success: true,
        message: 'Member removed successfully!'
    })

});

exports.leaveGroup = TryCatch(async (req, res, next) => {

    const chatId = req.params.id;

    // console.log(req.params.id)

    const chat = await Chat.findById(chatId)

    // console.log(chat)

    if (!chat) return next(new ErrorHandler('Chat not found', 404))

    if (!chat.groupChat) return next(new ErrorHandler('This is not a group chat', 404))

    //If group creator wants to leave the group
    const remainingMembers = chat.members.filter(
        (member) => member.toString() !== req.user.toString()
    )

    if (remainingMembers.length < 3) return next(new ErrorHandler('Group must have at least 3 members', 400))


    if (chat.creator.toString() === req.user.toString()) {
        const randomElement = Math.floor(Math.random() * remainingMembers.length)
        const newCreator = remainingMembers[randomElement]

        // console.log(randomElement)
        // console.log(newCreator)
        chat.creator = newCreator;
    }

    chat.members = remainingMembers;

    const user = await User.findById(req.user, 'name');

    chat.save()

    emitEvent(req, ALERT, chat.members, {
        message: `User${user.name} has left the group`,
        chatId
    })

    emitEvent(req, REFETCH_CHATS, chat.members)


    return res.status(200).json({
        success: true,
        message: 'Leave Group Sucessfully'
    })

});


exports.sendAttachments = TryCatch(async (req, res, next) => {

    const { chatId } = req.body

    const files = req.files || [];

    // console.log(files)

    if (files.length < 1) return next(new ErrorHandler('Please Upload Attachments', 400))

    if (files.length > 5) return next(new ErrorHandler("Files Can't Be More Than 5", 400))

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler('Chat not found', 404))

    const me = await User.findById(req.user, 'name')
    // console.log(me)



    if (files.length < 1) {
        return next(new ErrorHandler('Please provide attachments', 400))
    }

    //Upload files here //Cloudinary
    const attachments = await uploadFilesToCloudinary(files);

    // console.log(attachments)

    const messageForDatabase = {
        content: '',
        attachment: attachments,
        sender: me._id,
        chat: chatId,
    };

    const messageForRealTime = {
        content: '',
        attachment: attachments,
        sender: {
            _id: me._id,
            name: me.name
        },
        chat: chatId,
    };


    const message = await Message.create(messageForDatabase);

    // console.log(message)

    emitEvent(req, NEW_MESSAGE, chat.members, { message: messageForRealTime, chatId })

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId })

    res.status(200).json({
        success: true,
        message,
    })
})

exports.getChatDetails = TryCatch(async (req, res, next) => {

    if (req.query.populate === 'true') {
        // console.log('Populate')
        const chat = await Chat.findById(req.params.id).populate('members', 'name avatar').lean();

        if (!chat) return next(new ErrorHandler('Chat not found', 404))

        chat.members = chat.members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url
        }))


        return res.status(200).json({
            success: true,
            chat
        })

    } else {
        // console.log('Not Populate')
        const chat = await Chat.findById(req.params.id);

        if (!chat) return next(new ErrorHandler('Chat not found', 404))

        return res.status(200).json({
            success: true,
            chat
        })

    }
})

exports.renameGroup = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;
    const { name } = req.body;

    const chat = await Chat.findById(chatId)

    if (!chat) return next(new ErrorHandler('Chat not found', 404))

    if (!chat.groupChat) return next(new ErrorHandler('This is not a group chat', 404))


    if (chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler('You are not allowed to edit group name', 403))
    }

    chat.name = name;

    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members)

    return res.status(200).json({
        success: true,
        message: 'Group Renamed Successfully'
    })
})


exports.deleteChat = TryCatch(async (req, res, next) => {

    const chatId = req.params.id;

    const chat = await Chat.findById(chatId)

    if (!chat) return next(new ErrorHandler('Chat not found', 404))

    const members = chat.members;

    if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler('You are not allowed to edit group name', 403))
    }

    if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
        return next(new ErrorHandler('You are not allowed to delete the chat', 403))
    }

    //Here we have to delete all message and attachments file from cloudinary

    const messagesWithAttachmensts = await Message.find({ chat: chatId, attachments: { $exists: true, $ne: [] } })

    const public_ids = [];

    messagesWithAttachmensts.forEach(({ attachments }) =>
        attachments.forEach(({ public_id }) => public_ids.push(public_id))
    );

    await Promise.all([
        //Delete files from cloudinary
        deleteFilesFromCloudinary(public_ids),
        chat.deleteOne(),
        Message.deleteMany({ chat: chatId })
    ])

    emitEvent(req, REFETCH_CHATS, members)

    return res.status(200).json({
        success: true,
        message: 'Chat deleted successfully'
    })
})

exports.getMessages = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;
    const { page = 1 } = req.query;
    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const chat = await Chat.findById(chatId)

    if (!chat) return next(new ErrorHandler('Chat not found', 404))

    if (!chat.members.includes(req.user.toString())) {
        return next(new ErrorHandler("You are not allowed to access this chat", 403))
    }

    const [messages, totalMessageCount] = await Promise.all([
        Message.find({ chat: chatId }).sort({ createdAt: -1 }).skip(skip).limit(resultPerPage).populate('sender', 'name').lean(),
        Message.countDocuments({ chat: chatId })
    ])

    const totalPages = Math.ceil(totalMessageCount / resultPerPage) || 0;

    return res.status(200).json({
        success: true,
        message: messages.reverse(),
        totalPages
    })


})