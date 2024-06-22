const { faker, simpleFaker } = require('@faker-js/faker')
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

const createSingleChat = async (numOfChat) => {
    try {
        const users = await User.find().select('_id');

        const chatsPromise = [];
        for (let i = 0; i < numOfChat; i++) {
            for (let j = i + 1; j < users.length; j++) {
                chatsPromise.push(
                    Chat.create({
                        name: faker.lorem.words(1),
                        members: [users[i], users[j]]
                    })
                )
            }
        }

        await Promise.all(chatsPromise)
        console.log('Chats craeted successfully');
        process.exit()
    } catch (error) {
        console.error(error),
            process.exit(1)
    }
}
const createGroupChat = async (numOfChat) => {
    try {
        const users = await User.find().select('_id');

        const chatsPromise = [];
        for (let i = 0; i < numOfChat; i++) {
            const numMembers = simpleFaker.number.int({ min: 3, max: users.length })
            const members = []

            for (let i = 0; i < numMembers; i++) {
                const randomindex = Math.floor(Math.random() * users.length)
                const randmoUser = users[randomindex]

                // Ensure the same is not added twice
                if (!members.includes(randmoUser)) {
                    members.push(randmoUser)
                }

                const chat = Chat.create({
                    groupChat: true,
                    name: faker.lorem.word(1),
                    members,
                    creator: members[0]
                })
               
                chatsPromise.push(chat)
            }

            await Promise.all(chatsPromise)
            console.log('GroupChats craeted successfully');
            process.exit()
        }
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

const createMessage = async (numOfMessages) => {
    try {
        const users = await User.find().select('_id');
        const chats = await Chat.find().select('_id');

        const messagePromis = [];

        for (let i = 0; i < numOfMessages; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];

            const randomChat = chats[Math.floor(Math.random() * chats.length)];

            messagePromis.push(
                Message.create({
                    chat: randomChat,
                    sender: randomUser,
                    content: faker.lorem.sentence()
                })
            )
        }
        await Promise.all(messagePromis)
        console.log('Message craeted successfully');
        process.exit()
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

const createMessageInChat = async (chatId, numOfMessages) => {
    try {
        const users = await User.find().select('_id');
        const chats = await Chat.find().select('_id');

        const messagePromis = [];

        for (let i = 0; i < numOfMessages; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];

            messagePromis.push(
                Message.create({
                    chat: chatId,
                    sender: randomUser,
                    content: faker.lorem.sentence()
                })
            )
        }
        await Promise.all(messagePromis)
        console.log('Message craeted successfully');
        process.exit()
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}




module.exports = { createSingleChat, createGroupChat, createMessage, createMessageInChat }