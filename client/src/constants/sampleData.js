export const sampleChats = [
    {
        avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
        name: 'Karan Jesson',
        _id: '1',
        groupChat: false,
        members: ['1', '2']
    },
    {
        avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
        name: 'Hello world',
        _id: '2',
        groupChat: false,
        members: ['1', '2']
    },
]

export const sampleUsers = [
    {
        avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
        name: 'Karan Pal',
        _id: '1',
    },
    {
        avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
        name: 'Akant Pal',
        _id: '2',
    },
]

export const sampleNotifications = [
    {
        sender: {
            avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
            name: 'Karan Pal',
        },
        _id: '1',
    },
    {
        sender: {
            avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
            name: 'Akant Pal',
        },
        _id: '2',
    },
];

export const sampleMessage = [
    {
        attachment: [
            {
                public_id: 'ewfiof',
                url: 'https://www.w3schools.com/howto/img_avatar.png'
            },
        ],
        content: 'Hello world this is JavaScript',
        _id: '3874hr38498f3fken',
        sender: {
            _id: 'wefe3',
            name: 'Chaman'
        },
        chat: 'chatId',
        createdAt: '2025-03-15t10:41:30.672Z',
    },
    {
        attachment: [
            {
                public_id: 'ewfiof',
                url: 'https://www.w3schools.com/howto/img_avatar.png'
            },
        ],

        _id: '3874hr38498f3fken',
        sender: {
            _id: '123',
            name: 'Laman'
        },
        chat: 'chatId',
        createdAt: '2025-03-15t10:41:30.672Z',
    },
]

export const dashboardData = {
    users: [
        {
            name: 'john doe',
            avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            _id: '1',
            username: 'john_due',
            friends: '20',
            groups: '5'
        },
        {
            name: 'Jonny ',
            avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            _id: '2',
            username: 'jonny_func',
            friends: '20',
            groups: '5'
        },
    ],
    chats: [
        {
            name: 'JonDon Group ',
            avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
            _id: '1',
            groupChat: false,
            members: [
                { _id: '1', avatar: 'https://www.w3schools.com/howto/img_avatar.png' },
                { _id: '2', avatar: 'https://www.w3schools.com/howto/img_avatar.png' },
            ],
            totalMembers: 2,
            totalMessages: 20,
            creator: {
                name: 'Johnny',
                avatar: 'https://www.w3schools.com/howto/img_avatar.png'
            }
        },
        {
            name: 'Lallu Group ',
            avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
            _id: '3',
            groupChat: false,
            members: [
                { _id: '1', avatar: 'https://www.w3schools.com/howto/img_avatar.png' },
                { _id: '2', avatar: 'https://www.w3schools.com/howto/img_avatar.png' },
            ],
            totalMembers: 2,
            totalMessages: 20,
            creator: {
                name: 'Johnny',
                avatar: 'https://www.w3schools.com/howto/img_avatar.png'
            }
        },
    ],
    messages: [
        {
            attachment: [
                {
                    public_id: 'aouf9eh8f',
                    url: 'https://www.w3schools.com/howto/img_avatar.png',
                }
            ],
            content: 'This is a message',
            _id: 'w3i40349gn',
            sender: {
                _id: 'user_id',
                name: 'Chaman',
                avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            },
            chat: 'chatId',
            groupChat: true,
            createdAt: '2024-02-12T10:41:30.3349'
        },
        {
            attachment: [
               
            ],
            content: 'This is a message',
            _id: 'w3i40349gnew',
            sender: {
                _id: 'user_id',
                name: 'Chaman',
                avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            },
            chat: 'chatId',
            groupChat: true,
            createdAt: '2024-02-12T10:41:30.3349'
        },
    ]
}

